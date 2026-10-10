import { NextRequest, NextResponse } from 'next/server';
import { ai, isAiConfigured, articlesStore, sortArticlesByDate } from '@/lib/globals';
import { PIBScraper } from '@/services/pibScraper';
import { ArticleProcessor } from '@/services/articleProcessor';
import { PIBArticle } from '@/types'; // Ensure this path matches your types file
import type { DatabaseService as DatabaseServiceType } from '@/services/databaseService';

export async function POST(req: NextRequest) {
  if (!isAiConfigured()) {
    return NextResponse.json({
      success: false,
      message: 'Gemini AI not configured.',
    }, { status: 400 });
  }

  let dbService: DatabaseServiceType | null = null;

  try {
    const scraper = new PIBScraper();
    const processor = new ArticleProcessor(process.env.GEMINI_API_KEY!);
    
    const scrapedArticles = await scraper.scrapeHomepage();
    
    if (scrapedArticles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No articles found.',
      });
    }

    // Dynamically load DatabaseService so the route doesn't crash if Prisma isn't ready
    try {
      const { DatabaseService } = await import('@/services/databaseService');
      dbService = new DatabaseService();
    } catch (error) {
      console.error('[PIB Fetch] Database service is not available:', error);
      return NextResponse.json({
        success: false,
        message: 'Database service is not available. Articles were not fetched.',
      }, { status: 503 });
    }

    let newScraped = scrapedArticles;
    
    if (dbService) {
      newScraped = await dbService.filterNewArticles(scrapedArticles);
      if (newScraped.length === 0) {
        if (dbService?.disconnect) await dbService.disconnect();
        return NextResponse.json({
          success: true,
          message: 'All scraped articles are already in the database.',
          stats: { scraped: scrapedArticles.length, new: 0, processed: 0, saved: 0, updated: 0, skipped: scrapedArticles.length },
        });
      }
    }

    for (let i = 0; i < newScraped.length; i++) {
      const article = newScraped[i] as any;
      try {
        article.fullContent = await scraper.fetchArticleContent(article.url);
      } catch {
        article.fullContent = '';
      }
      if (i < newScraped.length - 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    const processedResults = await processor.processArticles(newScraped as any);

    let saveResult = { saved: 0, updated: 0, skipped: 0 };
    if (dbService) {
      const articlesToSave = processedResults.map((r: any) => r.processedArticle);
      saveResult = await dbService.saveArticles(articlesToSave);
      await dbService.disconnect();
      const { loadArticlesFromDB } = await import('@/lib/globals');
      await loadArticlesFromDB();
      dbService = null;
    }

    const newPIBArticles: PIBArticle[] = processedResults.map((r: any, idx: number) => {
      const p = r.processedArticle;
      const scraped = newScraped[idx] as any;
      return {
        id: `pib-live-${Date.now()}-${idx}`,
        title: p.title || scraped.title,
        ministry: p.ministry || scraped.ministry,
        date: p.date || scraped.date,
        pibId: p.pibId || scraped.pibId,
        gsPaper: (p.gsPaper as PIBArticle['gsPaper']) || 'Current Events',
        topic: p.topic || 'General Studies',
        prelimsImportance: (p.prelimsImportance as PIBArticle['prelimsImportance']) || 3,
        tags: p.tags || ['pib-live'],
        summaryBullets: p.summaryBullets || [scraped.summary],
        keyTakeaways: p.keyTakeaways || { keyPointers: [], nodalMinistryOrAgency: scraped.ministry },
        prelimsTrapAlert: p.prelimsTrapAlert || 'No specific traps identified',
        pyqYear: p.pyqYear,
        pyqContext: p.pyqContext,
        staticStudyBox: p.staticStudyBox,
        staticSyllabusLinkage: p.staticSyllabusLinkage || { subject: 'General Studies', relatedConcepts: [] },
        fullContent: scraped.fullContent,
        officialUrl: scraped.url,
      } as PIBArticle;
    });

    const existingPibIds = new Set(articlesStore.map((a) => a.pibId));
    const toAdd = newPIBArticles.filter((a) => !existingPibIds.has(a.pibId));
    articlesStore.unshift(...toAdd);
    articlesStore.splice(0, articlesStore.length, ...sortArticlesByDate(articlesStore));

    const dbStatus = `saved ${saveResult.saved} to MongoDB`;

    return NextResponse.json({
      success: true,
      message: `Fetched ${scrapedArticles.length} articles, processed ${processedResults.length} new ones with AI, ${dbStatus}.`,
      articles: toAdd.map((a) => ({
        id: a.id,
        title: a.title,
        ministry: a.ministry,
        date: a.date,
        gsPaper: a.gsPaper,
        topic: a.topic,
        prelimsImportance: a.prelimsImportance,
      })),
      stats: {
        scraped: scrapedArticles.length,
        new: newScraped.length,
        added: saveResult.saved + toAdd.length,
        processed: processedResults.length,
        saved: saveResult.saved,
        updated: saveResult.updated,
        skipped: saveResult.skipped,
        totalArticles: articlesStore.length,
        lastFetch: new Date().toISOString(),
      },
    });
    
  } catch (error: any) {
    if (dbService?.disconnect) {
      try {
        await dbService.disconnect();
      } catch (disconnectError) {
        console.error('[PIB Fetch] Failed to disconnect from the database:', disconnectError);
      }
    }
    console.error('[PIB Fetch] Article fetch failed:', error);
    return NextResponse.json({
      success: false,
      message: `Internal server error: ${error.message}`,
    }, { status: 500 });
  }
}