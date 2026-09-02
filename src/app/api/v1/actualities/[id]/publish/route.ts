import { NextResponse } from 'next/server';
import { readSeed, writeSeed } from '@/lib/seed';

export async function POST(request: Request, context: any) {
  const id = context?.params?.id as string;
  const { actualities } = readSeed();
  const idx = actualities.findIndex((x) => x.id === id || x.slug === id);
  if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 });
  actualities[idx].status = 'PUBLISHED';
  actualities[idx].publishedAt = new Date().toISOString();
  writeSeed({ actualities });
  return NextResponse.json({ data: actualities[idx] });
}
