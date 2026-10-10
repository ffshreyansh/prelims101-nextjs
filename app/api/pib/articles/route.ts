import { NextRequest, NextResponse } from 'next/server';
import { articlesStore, sortArticlesByDate, loadArticlesFromDB } from '@/lib/globals';

export async function GET(req: NextRequest) {
  try {
    await loadArticlesFromDB();
  } catch (error) {
    console.error('[API Articles] Failed to load articles from the database:', error);
    return NextResponse.json({
      success: false,
      message: 'Unable to load articles from the database.',
    }, { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  
  const search = searchParams.get('search');
  const gsPaper = searchParams.get('gsPaper');
  const ministry = searchParams.get('ministry');
  const tag = searchParams.get('tag');
  const pyqOnly = searchParams.get('pyqOnly');

  let filtered = sortArticlesByDate(articlesStore);

  if (pyqOnly === 'true') {
    filtered = filtered.filter((a) => !!a.pyqYear);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.ministry.toLowerCase().includes(q) ||
      a.topic.toLowerCase().includes(q)
    );
  }

  if (gsPaper && gsPaper !== 'ALL') {
    filtered = filtered.filter((a) => a.gsPaper === gsPaper);
  }

  if (ministry && ministry !== 'ALL') {
    filtered = filtered.filter((a) => a.ministry.toLowerCase() === ministry.toLowerCase());
  }

  if (tag && tag !== 'ALL') {
    filtered = filtered.filter((a) => a.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  return NextResponse.json({ success: true, articles: filtered });
}