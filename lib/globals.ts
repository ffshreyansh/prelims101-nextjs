import { GoogleGenAI } from '@google/genai';
import { initialPIBArticles } from '@/data/pibArticles';
import { initialMockQuestions, initialMockTests } from '@/data/mockQuestions';
import { PIBArticle, MockQuestion, MockTest, TestAttempt, User, RevisionItem } from '@/types';
import { connectPrisma, prisma } from './prisma';

// AI Initialization
export const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    })
  : null;

export const isAiConfigured = () => !!ai && !!process.env.GEMINI_API_KEY;

// Global Stores
export const articlesStore: PIBArticle[] = [...initialPIBArticles];
export const testsStore: MockTest[] = [...initialMockTests];
export const attemptsStore: TestAttempt[] = [];
export const revisionQueueStore: Record<string, Record<string, RevisionItem>> = {
  'user-demo': {
    'pib-2025-01': { articleId: 'pib-2025-01', status: 'pending', addedAt: new Date().toISOString() },
  },
};
export const usersStore: User[] = [
  {
    id: 'user-demo',
    name: 'Aspirant Shreyansh',
    email: 'shreyanshkumar1403@gmail.com',
    targetYear: '2025',
    optionalSubject: 'Public Administration',
    isGuest: false,
    freeTestsRemaining: 5,
    isSubscribed: false,
    planType: 'free',
    createdAt: new Date().toISOString(),
  },
];

// Helper Functions
export function sortArticlesByDate(articles: PIBArticle[]): PIBArticle[] {
  return [...articles].sort((a, b) => {
    const dateDifference = Date.parse(b.date) - Date.parse(a.date);
    if (Number.isFinite(dateDifference) && dateDifference !== 0) return dateDifference;
    return b.pibId.localeCompare(a.pibId, undefined, { numeric: true });
  });
}

export function inferGSPaper(title: string, ministry: string, content = ''): PIBArticle['gsPaper'] {
  const text = `${title} ${ministry} ${content}`.toLowerCase();
  if (/defen[cs]|military|army|navy|space|isro|technology|innovation|science|economy|finance|mines|environment|climate|agriculture|fertilizer|energy|रक्षा|सैन्य|विज्ञान|तकनीक|अंतरिक्ष|ऊर्जा|पर्यावरण|जलवायु|कृषि|खान|आर्थिक|अर्थव्यवस्था|नवाचार/.test(text)) {
    return 'GS-3';
  }
  if (/minister|cabinet|government|parliament|president|vice-president|police|law|act|rights|international|summit|diplomatic|मंत्री|प्रधानमंत्री|राष्ट्रपति|उपराष्ट्रपति|संसद|कानून|अधिनियम|अधिकार|राजनयिक|सम्मेलन/.test(text)) {
    return 'GS-2';
  }
  return 'Current Events';
}

export function dbArticleToPIBArticle(dbArticle: any): PIBArticle {
  const staticStudyBox = (
    dbArticle.staticBookReference ||
    dbArticle.staticChapterTopic ||
    dbArticle.staticWhatToRead ||
    dbArticle.staticCoreArticlesOrActs?.length
  ) ? {
    standardBook: dbArticle.staticBookReference || '',
    chapterTopic: dbArticle.staticChapterTopic || '',
    whatToRead: dbArticle.staticWhatToRead || '',
    coreArticlesOrActs: dbArticle.staticCoreArticlesOrActs || [],
  } : undefined;

  return {
    id: dbArticle.id,
    title: dbArticle.title,
    ministry: dbArticle.ministry,
    date: dbArticle.date,
    pibId: dbArticle.pibId,
    gsPaper: dbArticle.topic === 'General Studies' && dbArticle.gsPaper === 'GS-1'
      ? inferGSPaper(dbArticle.title, dbArticle.ministry, dbArticle.fullContent || '')
      : (['GS-1', 'GS-2', 'GS-3', 'Current Events'].includes(dbArticle.gsPaper)
        ? dbArticle.gsPaper
        : 'Current Events') as PIBArticle['gsPaper'],
    topic: dbArticle.topic || 'General Studies',
    prelimsImportance: (dbArticle.prelimsImportance as PIBArticle['prelimsImportance']) || 3,
    tags: dbArticle.tags || [],
    summaryBullets: dbArticle.summaryBullets || [],
    keyTakeaways: {
      statutoryOrConstitutional: dbArticle.statutoryOrConstitutional || undefined,
      nodalMinistryOrAgency: dbArticle.nodalMinistryOrAgency || dbArticle.ministry,
      fundingPattern: dbArticle.fundingPattern || undefined,
      objectives: dbArticle.objectives || [],
      eligibleBeneficiaries: dbArticle.eligibleBeneficiaries || undefined,
      keyPointers: dbArticle.keyPointers || [],
    },
    prelimsTrapAlert: dbArticle.prelimsTrapAlert || 'No specific traps identified',
    pyqYear: dbArticle.pyqYear || undefined,
    pyqContext: dbArticle.pyqTopic || undefined,
    staticStudyBox,
    staticSyllabusLinkage: {
      subject: dbArticle.syllabusSubject || dbArticle.gsPaper || 'General Studies',
      articleOrAct: dbArticle.syllabusArticleOrAct || undefined,
      relatedConcepts: dbArticle.syllabusRelatedConcepts || [],
    },
    fullContent: dbArticle.fullContent || undefined,
    officialUrl: dbArticle.officialUrl || undefined,
  };
}
export async function loadArticlesFromDB(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  await connectPrisma();
  const dbArticles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const dbArticlesForFeed = dbArticles.map(dbArticleToPIBArticle);
  articlesStore.splice(0, articlesStore.length, ...sortArticlesByDate(dbArticlesForFeed));
  console.log(`[DB] Loaded ${dbArticles.length} persisted articles into the feed`);
  return true;
}