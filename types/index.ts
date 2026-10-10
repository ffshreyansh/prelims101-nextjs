export type GSPaper = 'GS-1' | 'GS-2' | 'GS-3' | 'Current Events';

export interface PIBArticle {
  id: string;
  title: string;
  ministry: string;
  date: string;
  pibId: string;
  gsPaper: GSPaper;
  topic: string;
  prelimsImportance: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  summaryBullets: string[];
  keyTakeaways: {
    statutoryOrConstitutional?: string;
    nodalMinistryOrAgency?: string;
    fundingPattern?: string;
    objectives?: string[];
    eligibleBeneficiaries?: string;
    keyPointers: string[];
  };
  prelimsTrapAlert: string;
  pyqYear?: string;
  pyqContext?: string;
  staticStudyBox?: {
    standardBook: string;
    chapterTopic: string;
    whatToRead: string;
    coreArticlesOrActs: string[];
  };
  staticSyllabusLinkage: {
    subject: string;
    articleOrAct?: string;
    relatedConcepts: string[];
  };
  fullContent?: string;
  officialUrl?: string;
}

export type QuestionType = 'statement_based' | 'pair_matching' | 'assertion_reason' | 'single_choice';

export interface MockQuestion {
  id: string;
  articleId?: string;
  articleTitle?: string;
  gsPaper: GSPaper | string;
  topic: string;
  questionType: QuestionType;
  questionText: string;
  statements?: string[];
  options: {
    id: string; // 'A' | 'B' | 'C' | 'D'
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  prelimsTip: string;
  difficulty: 'Moderate' | 'UPSC Standard' | 'Tricky';
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  sourceArticleIds: string[];
  questions: MockQuestion[];
  durationMinutes: number;
  totalMarks: number;
  createdAt: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  timestamp: string;
  timeTakenSeconds: number;
  userAnswers: Record<string, string>; // questionId -> optionId ('A', 'B', etc)
  score: number; // +2 for correct, -0.66 for incorrect
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  subjectBreakdown: Record<string, { total: number; correct: number; incorrect: number }>;
}

export type RevisionStatus = 'pending' | 'mastered';

export interface RevisionItem {
  articleId: string;
  status: RevisionStatus;
  addedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  targetYear: string;
  optionalSubject?: string;
  isGuest?: boolean;
  freeTestsRemaining: number;
  isSubscribed: boolean;
  subscriptionExpiresAt?: string;
  planType?: string; // 'free' | 'prelims_2027'
  createdAt: string;
}

export interface AspirantAnalytics {
  totalArticlesRead: number;
  bookmarkedCount: number;
  testsAttempted: number;
  averageScore: number;
  overallAccuracy: number;
  studyStreakDays: number;
  subjectAccuracy: {
    subject: string;
    percentage: number;
    attempts: number;
  }[];
}
