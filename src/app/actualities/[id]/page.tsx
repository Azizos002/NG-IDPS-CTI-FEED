import Layout from '@/components/Layout';
import { readSeed } from '@/lib/seed';
import { notFound } from 'next/navigation';
import SeverityBadge from '@/components/SeverityBadge';
import IOCCard from '@/components/IOCCard';
import Link from 'next/link';
import { getThreatTypeLabel } from '@/lib/cti-format';
import { Database, Globe } from 'lucide-react';

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { actualities } = readSeed();
  const article = actualities.find((x) => x.id === id || x.slug === id);
  if (!article) return notFound();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const relatedArticles = actualities
    .filter(
      (a) =>
        a.id !== article.id &&
        a.status === 'PUBLISHED' &&
        (a.type === article.type || a.severity === article.severity)
    )
    .slice(0, 3);

  return (
    <Layout currentPage="/actualities">
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/actualities" className="hover:text-cyan-300 transition-colors">
          CTI Feed
        </Link>
        <span>/</span>
        <span className="text-slate-100 line-clamp-1">{article.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <SeverityBadge severity={article.severity} />
            <span className="text-sm font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-lg">
              {getThreatTypeLabel(article.type)}
            </span>
            {article.language && (
              <span className="text-sm font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-1.5 rounded-lg">
                {article.language}
              </span>
            )}
          </div>

          <h1 className="text-display text-slate-100 mb-4 leading-tight">{article.title}</h1>

          {article.summary && (
            <p className="text-xl text-slate-400 mb-8 leading-relaxed border-l-4 border-cyan-400 pl-6">
              {article.summary}
            </p>
          )}

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-5 mb-8">
            <div className="grid grid-cols-2 gap-6 text-sm">
              {article.publishedAt && (
                <div>
                  <div className="text-slate-500 mb-1">Published</div>
                  <div className="text-slate-100 font-medium font-mono">{formatDate(article.publishedAt)}</div>
                </div>
              )}
              {article.source && (
                <div>
                  <div className="text-slate-500 mb-1">Source</div>
                  {article.source.url ? (
                    <a
                      href={article.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      {article.source.name}
                    </a>
                  ) : (
                    <div className="text-slate-100 font-medium">{article.source.name}</div>
                  )}
                </div>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="col-span-2">
                  <div className="text-slate-500 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {article.content && (
            <div className="prose prose-invert max-w-none mb-8">
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">{article.content}</div>
            </div>
          )}

          {article.iocs && article.iocs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-heading-md text-slate-100 mb-5 pb-3 border-b border-slate-800 flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                Indicators of Compromise
              </h2>
              <div className="space-y-3">
                {article.iocs.map((ioc, idx) => (
                  <IOCCard key={idx} ioc={ioc} />
                ))}
              </div>
            </section>
          )}

          {article.references && article.references.length > 0 && (
            <section className="mb-8">
              <h2 className="text-heading-md text-slate-100 mb-5 pb-3 border-b border-slate-800 flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-400" />
                References
              </h2>
              <div className="space-y-3">
                {article.references.map((ref, idx) => (
                  <div key={idx} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-4">
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium break-all"
                      >
                        {ref.title || ref.url}
                      </a>
                    ) : (
                      <div className="text-slate-100 font-medium">{ref.title}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-100 mb-4 font-mono text-sm">At a Glance</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-500">Status</div>
                  <div className="text-emerald-400 font-medium font-mono capitalize">{article.status}</div>
                </div>
                <div>
                  <div className="text-slate-500">Type</div>
                  <div className="text-slate-100 font-medium">{getThreatTypeLabel(article.type)}</div>
                </div>
                {article.iocs && article.iocs.length > 0 && (
                  <div>
                    <div className="text-slate-500">IOCs</div>
                    <div className="text-cyan-300 font-medium font-mono">{article.iocs.length}</div>
                  </div>
                )}
                {article.tags && article.tags.length > 0 && (
                  <div>
                    <div className="text-slate-500">Tags</div>
                    <div className="text-slate-100 font-medium font-mono">{article.tags.length}</div>
                  </div>
                )}
              </div>
            </div>

            {relatedArticles.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-slate-100 mb-4 font-mono text-sm">Related Intelligence</h3>
                <div className="space-y-3">
                  {relatedArticles.map((related) => (
                    <a key={related.id} href={`/actualities/${related.id}`} className="block group">
                      <div className="text-sm font-medium text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1">
                        {related.title}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{related.severity}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Link
                href="/actualities"
                className="w-full px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-100 hover:border-slate-700 transition-colors font-medium"
              >
                Back to Feed
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
