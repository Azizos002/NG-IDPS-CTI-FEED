import { Actuality, IOC, Severity } from '@/models/actuality';

export function formatTimeAgo(dateString?: string) {
  if (!dateString) return 'n/a';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getThreatTypeLabel(type: string) {
  if (type === 'TECHNICAL_THREAT') return 'Technical Threat';
  if (type === 'AWARENESS') return 'Awareness';
  return type;
}

export function confidenceFromSeverity(severity: Severity | string) {
  if (severity === 'CRITICAL') return 95;
  if (severity === 'HIGH') return 85;
  if (severity === 'MEDIUM') return 70;
  if (severity === 'LOW') return 55;
  return 40;
}

export function iocTypeBadge(type: string) {
  const t = type.toLowerCase();
  if (t === 'ip') return { label: 'IPv4', className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
  if (t === 'hash') return { label: 'SHA256', className: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  if (t === 'domain') return { label: 'Domain', className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  if (t === 'url') return { label: 'URL', className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
  if (t === 'email') return { label: 'Email', className: 'text-slate-300 bg-slate-500/10 border-slate-500/30' };
  if (t === 'cve') return { label: 'CVE', className: 'text-red-400 bg-red-500/10 border-red-500/30' };
  return { label: type.toUpperCase(), className: 'text-slate-300 bg-slate-500/10 border-slate-500/30' };
}

export function actorTags(article: Actuality) {
  const tags = article.tags || [];
  const actors = tags.filter((tag) =>
    /apt|lazarus|cobalt|fancy|kimsuky|turla|sandworm|conti|lockbit|mitre|t\d{4}/i.test(tag)
  );
  if (actors.length) return actors.slice(0, 3);
  return tags.slice(0, 3);
}

export function flattenIocs(articles: Actuality[]) {
  const rows: { article: Actuality; ioc: IOC }[] = [];
  for (const article of articles) {
    if (article.iocs && article.iocs.length > 0) {
      for (const ioc of article.iocs) {
        rows.push({ article, ioc });
      }
    }
  }
  return rows;
}

export function collectMetrics(articles: Actuality[]) {
  const iocs = articles.flatMap((a) => a.iocs || []);
  const maliciousIps = iocs.filter((i) => i.type === 'ip').length;
  const actors = new Set(
    articles.flatMap((a) => actorTags(a)).filter((t) => /apt|lazarus|cobalt|fancy|kimsuky|turla|sandworm/i.test(t))
  );
  const confidences = articles.map((a) => confidenceFromSeverity(a.severity));
  const avgConfidence = confidences.length
    ? Math.round(confidences.reduce((sum, n) => sum + n, 0) / confidences.length)
    : 0;

  return {
    totalIocs: iocs.length,
    maliciousIps,
    threatActors: actors.size || new Set(articles.flatMap((a) => a.tags || [])).size,
    avgConfidence,
  };
}
