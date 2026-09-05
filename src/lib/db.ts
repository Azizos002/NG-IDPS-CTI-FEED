import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { NewsCategory, NewsItem } from '@/types/news';
import { DEFAULT_NEWS } from '@/lib/news';

const DB_PATH = path.join(process.cwd(), 'cti_feed.db');

interface ArticleRow {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  content: string;
  iocs: string;
  proposed_suricata_rule: string | null;
  created_at: string;
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) return dbInstance;

  dbInstance = new Database(DB_PATH);
  dbInstance.pragma('journal_mode = WAL');
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT CHECK(category IN ('AWARENESS', 'CRITICAL_ATTACK')) NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      iocs TEXT DEFAULT '[]',
      proposed_suricata_rule TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedIfEmpty(dbInstance);
  return dbInstance;
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare('SELECT COUNT(*) as n FROM articles').get() as { n: number };
  if (count.n > 0) return;

  const insert = db.prepare(`
    INSERT INTO articles (id, title, category, summary, content, iocs, proposed_suricata_rule, created_at)
    VALUES (@id, @title, @category, @summary, @content, @iocs, @proposed_suricata_rule, @created_at)
  `);

  const tx = db.transaction((items: NewsItem[]) => {
    for (const item of items) {
      insert.run(toRow(item));
    }
  });
  tx(DEFAULT_NEWS);
}

function toRow(item: NewsItem) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    summary: item.summary,
    content: item.content,
    iocs: JSON.stringify(item.iocs ?? []),
    proposed_suricata_rule: item.proposed_suricata_rule ?? null,
    created_at: item.createdAt,
  };
}

function fromRow(row: ArticleRow): NewsItem {
  let iocs: string[] = [];
  try {
    const parsed = JSON.parse(row.iocs || '[]');
    iocs = Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    iocs = [];
  }

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    summary: row.summary,
    content: row.content,
    iocs,
    proposed_suricata_rule: row.proposed_suricata_rule || undefined,
    createdAt: row.created_at,
  };
}

export function listArticles(): NewsItem[] {
  const rows = getDb()
    .prepare('SELECT * FROM articles ORDER BY datetime(created_at) DESC')
    .all() as ArticleRow[];
  return rows.map(fromRow);
}

export function insertArticle(item: NewsItem): NewsItem {
  getDb()
    .prepare(
      `
      INSERT INTO articles (id, title, category, summary, content, iocs, proposed_suricata_rule, created_at)
      VALUES (@id, @title, @category, @summary, @content, @iocs, @proposed_suricata_rule, @created_at)
    `
    )
    .run(toRow(item));
  return item;
}

export function dbFileExists() {
  return fs.existsSync(DB_PATH);
}
