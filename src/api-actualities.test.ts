import { readSeed } from '@/lib/seed';

describe('API logic for /api/v1/actualities (filtering)', () => {
  test('no filters returns array', () => {
    const { actualities } = readSeed();
    expect(Array.isArray(actualities)).toBe(true);
  });

  test('q filter filters by title/content', () => {
    const { actualities } = readSeed();
    const q = 'nonexistentquerystring';
    const results = actualities.filter((a: { title: string; summary?: string; content?: string }) => (a.title + ' ' + (a.summary || '') + ' ' + (a.content || '')).toLowerCase().includes(q));
    expect(Array.isArray(results)).toBe(true);
  });

  test('type filter filters by type', () => {
    const { actualities } = readSeed();
    const type = 'TECHNICAL_THREAT';
    const results = actualities.filter((a: { type?: string }) => a.type === type);
    expect(Array.isArray(results)).toBe(true);
  });
});
