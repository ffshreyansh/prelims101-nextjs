// Import the global instance, NOT PrismaClient directly
import { prisma } from '@/lib/prisma';
import { PIBArticle } from '@/types';

export class DatabaseService {
  // Remove the local 'private prisma: PrismaClient' property
  // Remove the constructor completely

  /**
   * Save or update articles in the database
   */
  async saveArticles(articles: Partial<PIBArticle>[]): Promise<{ saved: number; updated: number; skipped: number }> {
    let saved = 0;
    let updated = 0;
    let skipped = 0;

    for (const article of articles) {
      try {
        if (!article.pibId) {
          console.warn('Article missing pibId, skipping:', article.title);
          skipped++;
          continue;
        }

        // Use the imported global 'prisma' instance directly
        const existing = await prisma.article.findUnique({
          where: { slugId: article.pibId }
        });

        if (existing) {
          // Update existing article
          await prisma.article.update({
            where: { id: existing.id },
            data: this.mapToPrismaModel(article, false)
          });
          updated++;
          console.log(`Updated article: ${article.title}`);
        } else {
          // Create new article
          await prisma.article.create({
            data: this.mapToPrismaModel(article, true)
          });
          saved++;
          console.log(`Saved new article: ${article.title}`);
        }

      } catch (error) {
        console.error(`Error saving article "${article.title}":`, error);
        throw error;
      }
    }

    return { saved, updated, skipped };
  }

  private mapToPrismaModel(article: Partial<PIBArticle>, isNew: boolean): any {
    // ... (Keep this exact code the same as you provided) ...
  }

  /**
   * Get all existing PIB IDs from database
   */
  async getExistingPIBIds(): Promise<string[]> {
    const articles = await prisma.article.findMany({
      select: { pibId: true }
    });
    return articles.map(article => article.pibId).filter(Boolean);
  }

  /**
   * Filter out articles that already exist in database
   */
  async filterNewArticles(scrapedArticles: Array<{ pibId: string }>): Promise<Array<{ pibId: string }>> {
    const existingIds = await this.getExistingPIBIds();
    return scrapedArticles.filter(article => !existingIds.includes(article.pibId));
  }

  /**
   * Get count of articles in database
   */
  async getArticleCount(): Promise<number> {
    return prisma.article.count();
  }

  /**
   * Close database connection
   * Note: In Next.js with the global singleton, you rarely want to do this.
   * I am keeping the method here for compatibility with your ArticleFetchingService,
   * but it will now just do nothing to prevent connection dropping.
   */
  async disconnect(): Promise<void> {
    // Intentionally empty. 
    // Do not call prisma.$disconnect() in a Next.js environment.
    console.log("Disconnect skipped: Prisma manages its own connection pool.");
  }
}

export default DatabaseService;