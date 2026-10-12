import { GoogleGenAI } from '@google/genai';
import { PIBScrapedArticle } from './pibScraper';
import { GSPaper, PIBArticle } from '@/types';

export interface ProcessedArticle {
  scrapedArticle: PIBScrapedArticle;
  processedArticle: Partial<PIBArticle>;
}
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ArticleProcessor {
  private ai: GoogleGenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  /**
   * Process articles using AI to analyze UPSC relevance
   */
  async processArticles(articles: PIBScrapedArticle[]): Promise<ProcessedArticle[]> {
    if (!this.ai) {
      throw new Error('Gemini API not configured');
    }

    const processedArticles: ProcessedArticle[] = [];

    const processOne = async (article: PIBScrapedArticle): Promise<ProcessedArticle | null> => {
      try {
        console.log(`Processing article: ${article.title}`);

        const analysis = await this.analyzeArticle(article);

        const institutionalMilestone = this.isInstitutionalMilestone(article);
        if (analysis.isUPSCRelevant === false && !institutionalMilestone) {
          console.log(`[AI Filter] Skipped "${article.title}": ${analysis.rejectionReason}`);
          return null; 
        }
        if (analysis.isUPSCRelevant === false) {
          console.log(
            `[AI Filter] Keeping "${article.title}" because it covers a major institution's foundation or anniversary.`,
          );
        }
        const processed = this.formatToPIBArticle(article, analysis);

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { scrapedArticle: article, processedArticle: processed };
      } catch (error) {
        console.error(`Error processing article "${article.title}":`, error);
        // Keep the release in the feed when Gemini is temporarily unavailable.
        // The source content remains available and can be reprocessed on a later
        // refresh instead of silently dropping the latest release.
        return {
          scrapedArticle: article,
          processedArticle: this.formatToPIBArticle(article, this.getFallbackAnalysis(article)),
        };
      }
    };

    // Process a small batch concurrently so a full refresh completes in a
    // reasonable time without sending all requests at once.
    for (let index = 0; index < articles.length; index += 3) {
      const batch = await Promise.all(articles.slice(index, index + 3).map(processOne));
      processedArticles.push(
        ...batch.filter((result): result is ProcessedArticle => result !== null)
      );
      
      // If there are more articles left to process, wait before the next batch
      if (index + 3 < articles.length) {
        console.log('Waiting 45 seconds to reset the 5 RPM limit...');
        await delay(45000); // Wait 45 seconds so you average ~4 requests/min
      }
    }

    return processedArticles;
  }

  /**
   * Analyze a single article using Gemini AI
   */
  private async analyzeArticle(article: PIBScrapedArticle): Promise<AIArticleAnalysis> {
    const prompt = this.buildAnalysisPrompt(article);
    const ai = this.ai;
    if (!ai) {
      throw new Error('Gemini API not configured');
    }
    
    try {
      const result = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Gemini analysis timed out after 60 seconds')), 60000);
        }),
      ]);

      const responseText = result.text || '';
      return this.parseAIResponse(responseText);
      
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error(`Failed to analyze article with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build the prompt for AI analysis
   */
  private buildAnalysisPrompt(article: PIBScrapedArticle): string {
    return `
You are an expert UPSC (Union Public Service Commission) prelims analyst. Your task is to analyze a PIB (Press Information Bureau) article for UPSC Civil Services Preliminary Examination relevance.

ARTICLE DETAILS:
Title: ${article.title}
Ministry: ${article.ministry}
Date: ${article.date}
Summary: ${article.summary}
${article.fullContent ? `Content: ${article.fullContent.substring(0, 2000)}` : ''}

ANALYZE THIS ARTICLE AND PROVIDE THE FOLLOWING:

0. **UPSC Relevance Triage**:
   - Assess if this is genuinely useful for UPSC Prelims or Mains.
   - If the article is just a routine administrative meeting, festival greeting, condolence message, pure political rhetoric, or generic speech without policy substance, mark isUPSCRelevant as false.
   - Mark articles about the foundation day, anniversary, mandate, powers, composition, or functioning of important constitutional or statutory institutions as relevant, even if the release is framed as a celebration or event report. This includes bodies such as NHRC, Election Commission, CAG, UPSC, Finance Commission, CIC, CVC, NCSC, NCST, NCW, Lokpal, NGT, and similar UPSC-relevant institutions.
   - For an institutional milestone, prioritize exam-useful static facts about the institution: establishing law/year, constitutional or statutory status, composition and appointment, tenure, mandate/functions, powers and limitations, reporting, and relevant international standards. Include only facts you can state accurately; distinguish established facts from details not provided in the release and do not invent current officeholders or figures.
   - Also mark relevant articles about new schemes, cabinet decisions, scientific advancements, economic data, treaties, or constitutional matters.

1. **UPSC GS Paper Relevance** (Choose ONE):
   - GS-1 (Indian Heritage & Culture, History & Geography of the World & Society)
   - GS-2 (Governance, Constitution, Polity, Social Justice & International Relations)
   - GS-3 (Technology, Economic Development, Bio-diversity, Environment, Security & Disaster Management)
   - Current Events (if it's primarily news/update without direct syllabus linkage)

2. **Topic Classification** (1-3 topics, comma-separated):
   - What broader UPSC syllabus topics does this article relate to?

3. **Prelims Importance Score** (1-5, where 5 is most important):
   - How likely is this to appear in UPSC Prelims based on historical patterns?

4. **Key Tags** (5-10 tags, comma-separated):
   - Important keywords for search/filtering

5. **Summary Bullets** (3-5 bullet points):
   - Concise key takeaways for UPSC aspirants

6. **Key Takeaways Analysis**:
   - Statutory or Constitutional basis (if any)
   - Nodal Ministry/Agency responsible
   - Funding pattern (if mentioned)
   - Objectives (brief list if mentioned)
   - Eligible beneficiaries (if mentioned)
   - Key pointers (3-5 most important facts)

7. **Prelims Trap Alert**:
   - Common misconceptions or tricky aspects

8. **PYQ Linkage** (if any):
   - Has this topic appeared in previous years?
   - Which year and context?

9. **Static Study Box** (if applicable):
   - Standard book reference
   - Chapter/topic
   - What to read specifically
   - Core articles/acts mentioned

10. **Static Syllabus Linkage**:
    - Subject connection
    - Related articles/acts
    - Related concepts

FORMAT YOUR RESPONSE AS VALID JSON:

{
  "isUPSCRelevant": true,
  "rejectionReason": "string or null",
  "gsPaper": "GS-1" | "GS-2" | "GS-3" | "Current Events",
  "topic": "string",
  "prelimsImportance": 1-5,
  "tags": ["tag1", "tag2", ...],
  "summaryBullets": ["bullet1", "bullet2", ...],
  "keyTakeaways": {
    "statutoryOrConstitutional": "string or null",
    "nodalMinistryOrAgency": "string",
    "fundingPattern": "string or null",
    "objectives": ["obj1", "obj2", ...] or null,
    "eligibleBeneficiaries": "string or null",
    "keyPointers": ["pointer1", "pointer2", ...]
  },
  "prelimsTrapAlert": "string",
  "pyqYear": "string or null",
  "pyqContext": "string or null",
  "staticStudyBox": {
    "standardBook": "string or null",
    "chapterTopic": "string or null",
    "whatToRead": "string or null",
    "coreArticlesOrActs": ["act1", "act2", ...] or null
  } or null,
  "staticSyllabusLinkage": {
    "subject": "string",
    "articleOrAct": "string or null",
    "relatedConcepts": ["concept1", "concept2", ...]
  }
}

IMPORTANT: Return ONLY the JSON object, no additional text.`;
  }

  /**
   * Parse AI response into structured data
   */
  private parseAIResponse(responseText: string): AIArticleAnalysis {
    try {
      // Clean the response text - remove markdown code blocks and extra whitespace
      let cleanedText = responseText.trim();
      
      // Remove markdown code block markers
      cleanedText = cleanedText.replace(/```json\s*|\s*```/g, '');
      
      // Parse JSON
      const parsed = JSON.parse(cleanedText);
      
      // Validate and transform to our interface
      return {
        isUPSCRelevant: parsed.isUPSCRelevant ?? true, // Default to true if missing
        rejectionReason: parsed.rejectionReason || 'No reason provided',
        gsPaper: this.validateGSPaper(parsed.gsPaper),
        topic: parsed.topic || 'General Studies',
        prelimsImportance: this.validateImportanceScore(parsed.prelimsImportance),
        tags: Array.isArray(parsed.tags) ? parsed.tags : (parsed.tags || '').split(',').map((t: string) => t.trim()).filter((t: string) => t),
        summaryBullets: Array.isArray(parsed.summaryBullets) ? parsed.summaryBullets : [],
        keyTakeaways: {
          statutoryOrConstitutional: parsed.keyTakeaways?.statutoryOrConstitutional || null,
          nodalMinistryOrAgency: parsed.keyTakeaways?.nodalMinistryOrAgency || 'Not specified',
          fundingPattern: parsed.keyTakeaways?.fundingPattern || null,
          objectives: parsed.keyTakeaways?.objectives || null,
          eligibleBeneficiaries: parsed.keyTakeaways?.eligibleBeneficiaries || null,
          keyPointers: Array.isArray(parsed.keyTakeaways?.keyPointers) ? parsed.keyTakeaways.keyPointers : []
        },
        prelimsTrapAlert: parsed.prelimsTrapAlert || 'No specific traps identified',
        pyqYear: parsed.pyqYear || null,
        pyqContext: parsed.pyqContext || null,
        staticStudyBox: parsed.staticStudyBox || null,
        staticSyllabusLinkage: parsed.staticSyllabusLinkage || {
          subject: 'General Studies',
          articleOrAct: null,
          relatedConcepts: []
        }
      };
      
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response:', responseText);
      
      // Return default analysis if parsing fails
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Format scraped article and AI analysis into PIBArticle format
   */
  private formatToPIBArticle(
    scrapedArticle: PIBScrapedArticle,
    analysis: AIArticleAnalysis
  ): Partial<PIBArticle> {
    // Generate slug ID from title
    const slugId = scrapedArticle.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);

    return {
      title: scrapedArticle.title,
      ministry: scrapedArticle.ministry,
      date: scrapedArticle.date,
      pibId: scrapedArticle.pibId,
      gsPaper: analysis.gsPaper,
      topic: analysis.topic,
      prelimsImportance: analysis.prelimsImportance,
      tags: analysis.tags,
      summaryBullets: analysis.summaryBullets,
      keyTakeaways: {
        statutoryOrConstitutional: analysis.keyTakeaways.statutoryOrConstitutional || undefined,
        nodalMinistryOrAgency: analysis.keyTakeaways.nodalMinistryOrAgency,
        fundingPattern: analysis.keyTakeaways.fundingPattern || undefined,
        objectives: analysis.keyTakeaways.objectives || [],
        eligibleBeneficiaries: analysis.keyTakeaways.eligibleBeneficiaries || undefined,
        keyPointers: analysis.keyTakeaways.keyPointers
      },
      prelimsTrapAlert: analysis.prelimsTrapAlert,
      pyqYear: analysis.pyqYear || undefined,
      pyqContext: analysis.pyqContext || undefined,
      staticStudyBox: analysis.staticStudyBox ? {
        standardBook: analysis.staticStudyBox.standardBook || '',
        chapterTopic: analysis.staticStudyBox.chapterTopic || '',
        whatToRead: analysis.staticStudyBox.whatToRead || '',
        coreArticlesOrActs: analysis.staticStudyBox.coreArticlesOrActs || []
      } : undefined,
      staticSyllabusLinkage: {
        subject: analysis.staticSyllabusLinkage.subject,
        articleOrAct: analysis.staticSyllabusLinkage.articleOrAct || undefined,
        relatedConcepts: analysis.staticSyllabusLinkage.relatedConcepts
      },
      fullContent: scrapedArticle.fullContent,
      officialUrl: scrapedArticle.url
    };
  }

  /**
   * Validate GS Paper value
   */
  private validateGSPaper(paper: string): GSPaper {
    const validPapers: GSPaper[] = ['GS-1', 'GS-2', 'GS-3', 'Current Events'];
    if (validPapers.includes(paper as GSPaper)) {
      return paper as GSPaper;
    }
    return 'Current Events'; // Default
  }

  /**
   * Validate importance score
   */
  private validateImportanceScore(score: number): 1 | 2 | 3 | 4 | 5 {
    const validScore = Math.min(Math.max(Math.round(score), 1), 5);
    return validScore as 1 | 2 | 3 | 4 | 5;
  }

  private isInstitutionalMilestone(article: PIBScrapedArticle): boolean {
    const title = article.title;
    const isMilestone =
      /\b(?:foundation\s+day|foundation\s+anniversary|(?:\d{1,3}(?:st|nd|rd|th)\s+)?anniversary|years?\s+of\s+(?:service|establishment|existence))\b/i.test(
        title,
      );
    const isMajorInstitution =
      /\b(?:NHRC|National Human Rights Commission|Election Commission(?: of India)?|CAG|Comptroller and Auditor General|UPSC|Union Public Service Commission|Finance Commission|Central Information Commission|CIC|Central Vigilance Commission|CVC|National Commission for Scheduled Castes|NCSC|National Commission for Scheduled Tribes|NCST|National Commission for Women|NCW|Lokpal|National Green Tribunal|NGT|NITI Aayog|Reserve Bank of India|RBI|Securities and Exchange Board of India|SEBI|Telecom Regulatory Authority of India|TRAI)\b/i.test(
        title,
      );

    return isMilestone && isMajorInstitution;
  }

  /**
   * Get default analysis for error cases
   */
  private getDefaultAnalysis(): AIArticleAnalysis {
    return {
      isUPSCRelevant: true,
      rejectionReason: 'AI analysis unavailable; retaining the source article for review.',
      gsPaper: 'Current Events',
      topic: 'General Studies',
      prelimsImportance: 3,
      tags: ['government', 'policy', 'news'],
      summaryBullets: ['Important government announcement', 'Relevant for current affairs'],
      keyTakeaways: {
        statutoryOrConstitutional: null,
        nodalMinistryOrAgency: 'Not specified',
        fundingPattern: null,
        objectives: null,
        eligibleBeneficiaries: null,
        keyPointers: ['Check official announcement for details']
      },
      prelimsTrapAlert: 'No specific traps identified',
      pyqYear: null,
      pyqContext: null,
      staticStudyBox: null,
      staticSyllabusLinkage: {
        subject: 'General Studies',
        articleOrAct: null,
        relatedConcepts: []
      }
    };
  }

  private getFallbackAnalysis(article: PIBScrapedArticle): AIArticleAnalysis {
    const text = `${article.title} ${article.ministry} ${article.fullContent || ''}`.toLowerCase();
    const gsPaper: GSPaper = /defen[cs]|military|army|navy|space|isro|technology|innovation|science|economy|finance|mines|environment|climate|agriculture|fertilizer|energy/.test(text)
      ? 'GS-3'
      : /minister|cabinet|government|parliament|president|vice-president|police|law|act|rights|international|summit|diplomatic/.test(text)
        ? 'GS-2'
        : 'Current Events';

    return {
      ...this.getDefaultAnalysis(),
      gsPaper,
      topic: article.ministry || 'Current Affairs',
      tags: ['PIB', 'Current Affairs', gsPaper],
      summaryBullets: [article.summary, 'Refer to the official PIB release for the complete details.'],
      keyTakeaways: {
        ...this.getDefaultAnalysis().keyTakeaways,
        nodalMinistryOrAgency: article.ministry,
        keyPointers: ['AI enrichment is temporarily unavailable; review the official release for factual details.'],
      },
    };
  }
}

interface AIArticleAnalysis {
  isUPSCRelevant: boolean;      // ADD THIS
  rejectionReason?: string;     // ADD THIS
  gsPaper: GSPaper;
  topic: string;
  prelimsImportance: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  summaryBullets: string[];
  keyTakeaways: {
    statutoryOrConstitutional: string | null;
    nodalMinistryOrAgency: string;
    fundingPattern: string | null;
    objectives: string[] | null;
    eligibleBeneficiaries: string | null;
    keyPointers: string[];
  };
  prelimsTrapAlert: string;
  pyqYear: string | null;
  pyqContext: string | null;
  staticStudyBox: {
    standardBook: string | null;
    chapterTopic: string | null;
    whatToRead: string | null;
    coreArticlesOrActs: string[] | null;
  } | null;
  staticSyllabusLinkage: {
    subject: string;
    articleOrAct: string | null;
    relatedConcepts: string[];
  };
}

export default ArticleProcessor;