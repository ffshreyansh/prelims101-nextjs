import { NextRequest, NextResponse } from 'next/server';
import { ai, isAiConfigured, articlesStore, usersStore, testsStore } from '@/lib/globals';
import { MockTest, MockQuestion } from '@/types';
import { initialMockQuestions } from '@/data/mockQuestions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, articleIds, questionCount = 5, testTitle, category } = body;
    
    const user = usersStore.find((u) => u.id === userId) || usersStore[0];

    if (!user.isSubscribed) {
      if (user.freeTestsRemaining <= 0) {
        return NextResponse.json({
          success: false,
          error: 'paywall_limit_reached',
          message: 'You have used all 5 free mock tests. Upgrade to the Prelims 2027 Pro Pass.',
          freeTestsRemaining: 0,
        }, { status: 403 });
      }
      user.freeTestsRemaining = Math.max(0, user.freeTestsRemaining - 1);
    }

    const sourceArticles = articlesStore
      .filter((a) => (Array.isArray(articleIds) && articleIds.length > 0 ? articleIds.includes(a.id) : true))
      .slice(0, 5);

    if (!isAiConfigured() || !ai) {
      const fallbackTest: MockTest = {
        id: `test-curated-${Date.now()}`,
        title: testTitle || 'PIB High-Yield Prelims Test Series',
        description: 'Handcrafted UPSC standard questions based on official PIB releases.',
        sourceArticleIds: sourceArticles.map((a) => a.id),
        questions: initialMockQuestions.slice(0, Math.min(questionCount, initialMockQuestions.length)),
        durationMinutes: Math.min(questionCount * 2.5, 30),
        totalMarks: Math.min(questionCount, initialMockQuestions.length) * 2,
        createdAt: new Date().toISOString().split('T')[0],
      };
      testsStore.unshift(fallbackTest);
      return NextResponse.json({
        success: true,
        test: fallbackTest,
        freeTestsRemaining: user.freeTestsRemaining,
        isSubscribed: user.isSubscribed,
        generatedBy: 'curated_standard',
      });
    }

    const articlesContext = sourceArticles.map((a) => ({
      title: a.title,
      ministry: a.ministry,
      takeaways: a.keyTakeaways,
    }));

    const prompt = `You are the UPSC Civil Services Examination Paper Setter... [TRUNCATED FOR BREVITY] Context: ${JSON.stringify(articlesContext)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsedQuestions: MockQuestion[] = JSON.parse(response.text?.trim() || '[]');
    const formattedQuestions = parsedQuestions.map((q, idx) => ({
      ...q,
      id: `gen-q-${Date.now()}-${idx + 1}`,
      articleId: sourceArticles[idx % sourceArticles.length]?.id,
    }));

    const newTest: MockTest = {
      id: `test-gen-${Date.now()}`,
      title: testTitle || `PIB Mock Test: Allied Topics`,
      description: `Targeted UPSC Prelims test based on latest PIB releases.`,
      sourceArticleIds: sourceArticles.map((a) => a.id),
      questions: formattedQuestions,
      durationMinutes: Math.max(10, formattedQuestions.length * 2),
      totalMarks: formattedQuestions.length * 2,
      createdAt: new Date().toISOString().split('T')[0],
    };

    testsStore.unshift(newTest);
    
    return NextResponse.json({
      success: true,
      test: newTest,
      freeTestsRemaining: user.freeTestsRemaining,
      isSubscribed: user.isSubscribed,
      generatedBy: 'gemini-2.5-flash',
    });

  } catch (error) {
    console.error('Error generating mock test:', error);
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 });
  }
}