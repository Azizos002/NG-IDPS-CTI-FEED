export type ThreatType = 'TECHNICAL_THREAT' | 'AWARENESS' | string;

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface IOC {
  type: 'ip' | 'domain' | 'url' | 'hash' | 'email' | string;
  value: string;
  firstSeen?: string; // ISO date
}

export interface Reference {
  title?: string;
  url?: string;
}

export interface Actuality {
  id: string; // stable UUID
  slug?: string;
  title: string;
  summary?: string;
  content?: string; // markdown
  type: ThreatType;
  severity: Severity;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'DEPRECATED';
  publishedAt?: string; // ISO
  source?: { id?: string; name: string; url?: string };
  tags: string[];
  iocs: IOC[];
  references: Reference[];
  language?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}
