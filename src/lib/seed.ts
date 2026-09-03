import fs from 'fs';
import path from 'path';
import { Actuality } from '@/models/actuality';

const SEED_PATH = path.join(process.cwd(), 'src', 'data', 'seed.json');

export function readSeed(): { actualities: Actuality[] } {
  const raw = fs.readFileSync(SEED_PATH, { encoding: 'utf-8' });
  return JSON.parse(raw) as { actualities: Actuality[] };
}

export function writeSeed(data: { actualities: Actuality[] }) {
  fs.writeFileSync(SEED_PATH, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
}
