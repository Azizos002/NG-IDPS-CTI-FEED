export type NewsCategory = 'AWARENESS' | 'CRITICAL_ATTACK';

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  content: string;
  iocs: string[];
  proposed_suricata_rule?: string;
  createdAt: string;
}
