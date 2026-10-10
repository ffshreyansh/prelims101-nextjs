import PIBScraper from './pibScraper';
import ArticleProcessor from './articleProcessor';
import DatabaseService from './databaseService';
import dotenv from 'dotenv';

dotenv.config();

export class ArticleFetchingService {
  private scraper: PIBScraper;
  private processor: ArticleProcessor;
  private dbService: DatabaseService;
  
  constructor() {
    this.scraper = new PIBScraper();
    this.processor = new ArticleProcessor(process.env.GEMINI_API_KEY);
    this.dbService = new DatabaseService();
  }

  /**
   * Run the complete article fetching and processing pipeline
   */
  async run(): Promise<PipelineResult> {
    console.log('Starting article fetching pipeline...');
    
    try {
      // Step 1: Scrape articles from PIB
      console.log('Step 1: Scraping articles from PIB...');
      const scrapedArticles = await this.scraper.scrapeHomepage();
      
      if (scrapedArticles.length === 0) {
        console.log('No articles found on PIB homepage');
        return { 
          success: false, 
          message: 'No articles found on PIB homepage',
          stats: { scraped: 0, filtered: 0, processed: 0, saved: 0, updated: 0, skipped: 0 }
        };
      }

      console.log(`Found ${scrapedArticles.length} articles`);
      
      // Step 2: Fetch content for each article (with rate limiting)
      console.log('Step 2: Fetching article content...');
      for (let i = 0; i < scrapedArticles.length; i++) {
        const article = scrapedArticles[i];
        try {
          const content = await this.scraper.fetchArticleContent(article.url);
          article.fullContent = content;
          console.log(`Fetched content for article ${i + 1}/${scrapedArticles.length}`);
          
          // Rate limiting: wait between requests
          if (i < scrapedArticles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`Failed to fetch content for article: ${article.title}`, error);
        }
      }

      // Step 3: Filter out articles that already exist in database
      console.log('Step 3: Filtering out existing articles...');
      const newArticles = await this.dbService.filterNewArticles(scrapedArticles);
      console.log(`${newArticles.length} new articles (out of ${scrapedArticles.length} total)`);

      if (newArticles.length === 0) {
        console.log('No new articles to process');
        await this.dbService.disconnect();
        return { 
          success: true, 
          message: 'No new articles found',
          stats: { 
            scraped: scrapedArticles.length, 
            filtered: 0, 
            processed: 0, 
            saved: 0, 
            updated: 0, 
            skipped: scrapedArticles.length 
          }
        };
      }

      // Step 4: Process articles with AI (only new ones)
      console.log('Step 4: Processing articles with AI...');
      const filteredScrapedArticles = scrapedArticles.filter(article => 
        newArticles.some(newArticle => newArticle.pibId === article.pibId)
      );
      
      const processedResults = await this.processor.processArticles(filteredScrapedArticles);
      console.log(`AI processed ${processedResults.length} articles`);

      // Step 5: Save processed articles to database
      console.log('Step 5: Saving articles to database...');
      const articlesToSave = processedResults.map(result => result.processedArticle);
      const saveResult = await this.dbService.saveArticles(articlesToSave);

      // Step 6: Summary
      console.log('Step 6: Pipeline completed!');
      console.log('Summary:', {
        scraped: scrapedArticles.length,
        filtered: newArticles.length,
        processed: processedResults.length,
        saved: saveResult.saved,
        updated: saveResult.updated,
        skipped: saveResult.skipped
      });

      await this.dbService.disconnect();

      return {
        success: true,
        message: `Pipeline completed successfully. Saved ${saveResult.saved} new articles, updated ${saveResult.updated} existing articles.`,
        stats: {
          scraped: scrapedArticles.length,
          filtered: newArticles.length,
          processed: processedResults.length,
          saved: saveResult.saved,
          updated: saveResult.updated,
          skipped: saveResult.skipped + (scrapedArticles.length - newArticles.length)
        }
      };

    } catch (error) {
      console.error('Pipeline failed:', error);
      
      try {
        await this.dbService.disconnect();
      } catch (disconnectError) {
        console.error('Error disconnecting from database:', disconnectError);
      }

      return {
        success: false,
        message: `Pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error : new Error('Unknown error'),
        stats: { scraped: 0, filtered: 0, processed: 0, saved: 0, updated: 0, skipped: 0 }
      };
    }
  }

  /**
   * Run the pipeline with dry-run option (no database saves)
   */
  async runDry(): Promise<PipelineResult> {
    console.log('Running DRY RUN (no database saves)...');
    
    try {
      const scrapedArticles = await this.scraper.scrapeHomepage();
      
      if (scrapedArticles.length === 0) {
        return { 
          success: false, 
          message: 'No articles found on PIB homepage',
          stats: { scraped: 0, filtered: 0, processed: 0, saved: 0, updated: 0, skipped: 0 }
        };
      }

      // Fetch content for first 2 articles only (to test)
      const testArticles = scrapedArticles.slice(0, 2);
      for (const article of testArticles) {
        article.fullContent = await this.scraper.fetchArticleContent(article.url);
      }

      const processedResults = await this.processor.processArticles(testArticles);

      console.log('DRY RUN Results:');
      console.log(`Scraped: ${scrapedArticles.length} articles`);
      console.log(`Processed: ${processedResults.length} articles`);
      console.log('\nSample processed article:');
      if (processedResults.length > 0) {
        const sample = processedResults[0];
        console.log(JSON.stringify(sample.processedArticle, null, 2));
      }

      await this.dbService.disconnect();

      return {
        success: true,
        message: `Dry run completed. Would process ${scrapedArticles.length} articles.`,
        stats: {
          scraped: scrapedArticles.length,
          filtered: testArticles.length,
          processed: processedResults.length,
          saved: 0,
          updated: 0,
          skipped: scrapedArticles.length - testArticles.length
        }
      };

    } catch (error) {
      console.error('Dry run failed:', error);
      await this.dbService.disconnect();
      return {
        success: false,
        message: `Dry run failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error : new Error('Unknown error'),
        stats: { scraped: 0, filtered: 0, processed: 0, saved: 0, updated: 0, skipped: 0 }
      };
    }
  }

  /**
   * Check if required environment variables are set
   */
  checkEnvironment(): EnvironmentCheck {
    const missing: string[] = [];
    
    if (!process.env.GEMINI_API_KEY) {
      missing.push('GEMINI_API_KEY');
    }

    if (!process.env.DATABASE_URL) {
      missing.push('DATABASE_URL');
    }

    return {
      ok: missing.length === 0,
      missing,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      databaseConfigured: !!process.env.DATABASE_URL
    };
  }
}

export interface PipelineResult {
  success: boolean;
  message: string;
  error?: Error;
  stats: {
    scraped: number;
    filtered: number;
    processed: number;
    saved: number;
    updated: number;
    skipped: number;
  };
}

export interface EnvironmentCheck {
  ok: boolean;
  missing: string[];
  geminiConfigured: boolean;
  databaseConfigured: boolean;
}

export default ArticleFetchingService;