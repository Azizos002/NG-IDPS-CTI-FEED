import { NextResponse } from 'next/server';
import { readSeed } from '@/lib/seed';

export async function GET(request: Request) {
  try {
    const { actualities } = readSeed();
    const url = new URL(request.url);
    const since = url.searchParams.get('since');

    let results = actualities.filter((a) => a.status === 'PUBLISHED');
    if (since) {
      results = results.filter((a) => a.publishedAt && new Date(a.publishedAt) > new Date(since));
    }

    // Provide a stable, minimal machine-friendly feed
    const feed = results.map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      type: a.type,
      severity: a.severity,
      publishedAt: a.publishedAt,
      tags: a.tags,
      iocs: a.iocs,
      references: a.references,
      language: a.language,
    }));

    return NextResponse.json({ version: 'v1', count: feed.length, items: feed });
  } catch (err: unknown) {
    console.error('GET /api/v1/feed error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
