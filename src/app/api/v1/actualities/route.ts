import { NextResponse } from 'next/server';
import { readSeed, writeSeed } from '@/lib/seed';
import { v4 as uuidv4 } from 'uuid';
import { Actuality } from '@/models/actuality';

export async function GET(request: Request) {
  const { actualities } = readSeed();
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const type = url.searchParams.get('type');
  const severity = url.searchParams.get('severity');

  let results = actualities.slice();
  if (q) {
    const qq = q.toLowerCase();
    results = results.filter((a) => (a.title + ' ' + (a.summary || '') + ' ' + (a.content || '')).toLowerCase().includes(qq));
  }
  if (type) results = results.filter((a) => a.type === type);
  if (severity) results = results.filter((a) => a.severity === severity);

  return NextResponse.json({ data: results });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Actuality>;
  const { actualities } = readSeed();
  const now = new Date().toISOString();
  const item: Actuality = {
    id: uuidv4(),
    slug: payload.slug,
    title: payload.title ?? 'Untitled',
    summary: payload.summary ?? '',
    content: payload.content ?? '',
    type: payload.type ?? 'TECHNICAL_THREAT',
    severity: payload.severity ?? 'MEDIUM',
    status: payload.status ?? 'DRAFT',
    publishedAt: payload.publishedAt,
    source: payload.source,
    tags: payload.tags ?? [],
    iocs: payload.iocs ?? [],
    references: payload.references ?? [],
    language: payload.language ?? 'en',
    createdBy: payload.createdBy ?? 'unknown',
    createdAt: now,
    updatedAt: now,
  };
  actualities.unshift(item);
  writeSeed({ actualities });
  return NextResponse.json({ data: item }, { status: 201 });
}
