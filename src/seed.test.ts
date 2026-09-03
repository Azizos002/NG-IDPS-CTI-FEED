import { readSeed } from '@/lib/seed';

describe('seed I/O', () => {
  test('readSeed returns actualities array', () => {
    const data = readSeed();
    expect(data).toBeDefined();
    expect(Array.isArray(data.actualities)).toBe(true);
    expect(data.actualities.length).toBeGreaterThanOrEqual(0);
  });
});
