import fs from 'fs';
import path from 'path';
import { NewsItem } from '@/types/news';
import { DEFAULT_NEWS } from '@/lib/news';

// On Vercel, store in the writable /tmp directory. Locally, store in /data/articles.json
const DATA_DIR = process.env.VERCEL
  ? '/tmp'
  : path.join(process.cwd(), 'data');

const FILE_PATH = path.join(DATA_DIR, 'articles.json');

function ensureFileExists(): NewsItem[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_NEWS, null, 2), 'utf-8');
    return DEFAULT_NEWS;
  }

  try {
    const fileData = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(fileData) as NewsItem[];
  } catch {
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_NEWS, null, 2), 'utf-8');
    return DEFAULT_NEWS;
  }
}

export function listArticles(): NewsItem[] {
  const articles = ensureFileExists();
  return articles.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function insertArticle(item: NewsItem): NewsItem {
  const articles = ensureFileExists();
  const updated = [item, ...articles];
  fs.writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  return item;
}

export function resetArticles(): NewsItem[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_NEWS, null, 2), 'utf-8');
  return DEFAULT_NEWS;
}