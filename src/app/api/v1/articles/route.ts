import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { insertArticle, listArticles } from '@/lib/db';
import { NewsCategory, NewsItem } from '@/types/news';

export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json({ data: listArticles() });
  } catch (err: unknown) {
    console.error('GET /api/v1/articles error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<NewsItem>;
    const title = payload.title?.trim() ?? '';
    const content = payload.content?.trim() ?? '';
    const category = payload.category;

    if (title.length < 3 || content.length < 10) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    if (category !== 'AWARENESS' && category !== 'CRITICAL_ATTACK') {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const item: NewsItem = {
      id: payload.id || uuidv4(),
      title,
      category: category as NewsCategory,
      summary: (payload.summary ?? '').trim(),
      content,
      iocs: Array.isArray(payload.iocs) ? payload.iocs.map(String).filter(Boolean) : [],
      proposed_suricata_rule: payload.proposed_suricata_rule?.trim() || undefined,
      createdAt: payload.createdAt || new Date().toISOString(),
    };

    insertArticle(item);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (err: unknown) {
    console.error('POST /api/v1/articles error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
