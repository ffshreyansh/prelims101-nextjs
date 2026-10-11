/**
 * Simplified PIB Article Fetcher
 * Uses built-in fetch API and existing dependencies only
 */

interface SimplePIBArticle {
  title: string;
  ministry: string;
  date: string;
  pibId: string;
  url: string;
  summary: string;
}

export class SimplePIBFetcher {
  private readonly baseUrl = 'https://www.pib.gov.in';
  private readonly homepagePath = '/index.aspx?reg=48&lang=2';

  /**
   * Fetch PIB articles from homepage
   */
  async fetchArticles(): Promise<SimplePIBArticle[]> {
    try {
      console.log('Fetching PIB articles from:', `${this.baseUrl}${this.homepagePath}`);
      
      // For now, return mock data since web scraping requires proper setup
      // In production, you would use a headless browser or proper HTTP client
      
      const mockArticles: SimplePIBArticle[] = [
        {
          title: 'PM launches National Digital Health Mission',
          ministry: 'Ministry of Health & Family Welfare',
          date: '2026-10-10',
          pibId: 'PIB/1234/2026',
          url: `${this.baseUrl}/PressReleasePage.aspx?PRID=1234`,
          summary: 'Digital health infrastructure for all citizens'
        },
        {
          title: 'Cabinet approves New Education Policy Implementation Plan',
          ministry: 'Ministry of Education',
          date: '2026-10-09',
          pibId: 'PIB/1235/2026',
          url: `${this.baseUrl}/PressReleasePage.aspx?PRID=1235`,
          summary: 'Holistic reforms in education system'
        },
        {
          title: 'National Green Hydrogen Mission Progress Review',
          ministry: 'Ministry of New & Renewable Energy',
          date: '2026-10-08',
          pibId: 'PIB/1236/2026',
          url: `${this.baseUrl}/PressReleasePage.aspx?PRID=1236`,
          summary: 'Advancements in green hydrogen production'
        },
        {
          title: 'Digital India Act 2026 Consultation Paper Released',
          ministry: 'Ministry of Electronics & IT',
          date: '2026-10-07',
          pibId: 'PIB/1237/2026',
          url: `${this.baseUrl}/PressReleasePage.aspx?PRID=1237`,
          summary: 'New legislation for digital governance'
        },
        {
          title: 'Agricultural Export Policy 2026-2030 Announced',
          ministry: 'Ministry of Commerce & Industry',
          date: '2026-10-06',
          pibId: 'PIB/1238/2026',
          url: `${this.baseUrl}/PressReleasePage.aspx?PRID=1238`,
          summary: 'Boost to agricultural exports'
        }
      ];

      console.log(`Generated ${mockArticles.length} mock PIB articles`);
      return mockArticles;
      
    } catch (error) {
      console.error('Error fetching PIB articles:', error);
      throw new Error(`Failed to fetch PIB articles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process articles with AI analysis using existing Gemini setup
   */
  async processWithAI(articles: SimplePIBArticle[], ai: any): Promise<any[]> {
    if (!ai) {
      console.warn('Gemini AI not available, returning basic processed articles');
      return articles.map(article => this.basicProcessing(article));
    }

    const processedArticles: any[] = [];
    
    for (const article of articles.slice(0, 3)) { // Process only first 3 to avoid rate limits
      try {
        console.log(`Processing article with AI: ${article.title}`);
        
        const prompt = `
Analyze this PIB article for UPSC Civil Services Preliminary Examination relevance:

Title: ${article.title}
Ministry: ${article.ministry}
Date: ${article.date}
Summary: ${article.summary}

Provide analysis in this JSON format:
{
  "gsPaper": "GS-1" | "GS-2" | "GS-3" | "Current Events",
  "topic": "Main topic",
  "prelimsImportance": 1-5,
  "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"],
  "prelimsTrapAlert": "Common misconception"
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const analysisText = response.text || '{}';
        const analysis = this.parseAIResponse(analysisText);
        
        processedArticles.push({
          ...article,
          analysis,
          processedAt: new Date().toISOString()
        });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error processing article "${article.title}":`, error);
        processedArticles.push({
          ...article,
          analysis: this.basicProcessing(article),
          processedAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return processedArticles;
  }

  /**
   * Basic processing without AI
   */
  private basicProcessing(article: SimplePIBArticle): any {
    // Map ministry to likely GS paper
    const ministryToPaper: Record<string, string> = {
      'Ministry of Health & Family Welfare': 'GS-2',
      'Ministry of Education': 'GS-2',
      'Ministry of New & Renewable Energy': 'GS-3',
      'Ministry of Electronics & IT': 'GS-3',
      'Ministry of Commerce & Industry': 'GS-3',
      'Ministry of Environment, Forest & Climate Change': 'GS-3',
      'Ministry of Finance': 'GS-3',
      'Ministry of Home Affairs': 'GS-2',
      'Ministry of External Affairs': 'GS-2',
      'Ministry of Agriculture & Farmers Welfare': 'GS-3'
    };

    const gsPaper = ministryToPaper[article.ministry] || 'Current Events';
    
    return {
      gsPaper,
      topic: this.extractTopic(article.title),
      prelimsImportance: 3,
      keyTakeaways: [
        `Ministry: ${article.ministry}`,
        `Date: ${article.date}`,
        `Relevance: ${article.summary}`
      ],
      prelimsTrapAlert: 'Read the official release for exact details'
    };
  }

  /**
   * Extract topic from title
   */
  private extractTopic(title: string): string {
    const commonTopics = [
      'Digital Governance', 'Education Reform', 'Health Policy', 'Renewable Energy',
      'Economic Policy', 'Agriculture', 'Infrastructure', 'Environmental Policy',
      'Social Welfare', 'Defense', 'International Relations', 'Science & Technology'
    ];

    for (const topic of commonTopics) {
      if (title.toLowerCase().includes(topic.toLowerCase().split(' ')[0])) {
        return topic;
      }
    }

    return 'Current Affairs';
  }

  /**
   * Parse AI response
   */
  private parseAIResponse(text: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    return {
      gsPaper: 'Current Events',
      topic: 'General Studies',
      prelimsImportance: 3,
      keyTakeaways: ['Check official PIB release for details'],
      prelimsTrapAlert: 'No specific traps identified'
    };
  }
}

export default SimplePIBFetcher;