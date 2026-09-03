import Layout from '@/components/Layout';
import { readSeed } from '@/lib/seed';
import { notFound } from 'next/navigation';
import SeverityBadge from '@/components/SeverityBadge';
import IOCCard from '@/components/IOCCard';
import Link from 'next/link';

export default function ArticleDetailPage({ params }: { params: { id: string } }) {
  const { actualities } = readSeed();
  const article = actualities.find((x) => x.id === params.id || x.slug === params.id);
  if (!article) return notFound();

  const getThreatTypeLabel = (type: string) => {
    if (type === 'TECHNICAL_THREAT') return 'Technical Threat';
    if (type === 'AWARENESS') return 'Awareness';
    return type;
  };

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
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-text-secondary">
        <Link href="/actualities" className="hover:text-foreground transition-colors">
          Actualités
        </Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{article.title}</span>
      </div>

      {/* Main Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <SeverityBadge severity={article.severity} />
            <span className="text-sm font-medium text-text-secondary bg-cti-800 px-4 py-1.5 rounded-lg">
              {getThreatTypeLabel(article.type)}
            </span>
            {article.language && (
              <span className="text-sm font-medium text-text-secondary bg-cti-800 px-4 py-1.5 rounded-lg">
                {article.language}
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-display text-foreground mb-4 leading-tight">{article.title}</h1>

          {/* Summary/Lead */}
          {article.summary && (
            <p className="text-xl text-text-secondary mb-8 leading-relaxed border-l-4 border-blue-500 pl-6">
              {article.summary}
            </p>
          )}

          {/* Metadata */}
          <div className="bg-cti-800 border border-cti-600 rounded-lg p-5 mb-8">
            <div className="grid grid-cols-2 gap-6 text-sm">
              {article.publishedAt && (
                <div>
                  <div className="text-text-tertiary mb-1">Published</div>
                  <div className="text-foreground font-medium">{formatDate(article.publishedAt)}</div>
                </div>
              )}
              {article.source && (
                <div>
                  <div className="text-text-tertiary mb-1">Source</div>
                  {article.source.url ? (
                    <a
                      href={article.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      {article.source.name}
                    </a>
                  ) : (
                    <div className="text-foreground font-medium">{article.source.name}</div>
                  )}
                </div>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="col-span-2">
                  <div className="text-text-tertiary mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded bg-cti-700 text-text-secondary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          {article.content && (
            <div className="prose prose-invert max-w-none mb-8">
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">{article.content}</div>
            </div>
          )}

          {/* IOCs Section */}
          {article.iocs && article.iocs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-heading-md text-foreground mb-5 pb-3 border-b border-cti-600">
                🔍 Indicators of Compromise
              </h2>
              <div className="space-y-3">
                {article.iocs.map((ioc, idx) => (
                  <IOCCard key={idx} ioc={ioc} />
                ))}
              </div>
            </section>
          )}

          {/* References Section */}
          {article.references && article.references.length > 0 && (
            <section className="mb-8">
              <h2 className="text-heading-md text-foreground mb-5 pb-3 border-b border-cti-600">
                📚 References
              </h2>
              <div className="space-y-3">
                {article.references.map((ref, idx) => (
                  <div key={idx} className="bg-cti-800 border border-cti-600 rounded-lg p-4">
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium break-all"
                      >
                        {ref.title || ref.url}
                      </a>
                    ) : (
                      <div className="text-foreground font-medium">{ref.title}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Quick Stats */}
            <div className="bg-cti-800 border border-cti-600 rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-4">📊 At a Glance</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-text-tertiary">Status</div>
                  <div className="text-foreground font-medium capitalize">{article.status}</div>
                </div>
                <div>
                  <div className="text-text-tertiary">Type</div>
                  <div className="text-foreground font-medium">{getThreatTypeLabel(article.type)}</div>
                </div>
                {article.iocs && article.iocs.length > 0 && (
                  <div>
                    <div className="text-text-tertiary">IOCs</div>
                    <div className="text-foreground font-medium">{article.iocs.length}</div>
                  </div>
                )}
                {article.tags && article.tags.length > 0 && (
                  <div>
                    <div className="text-text-tertiary">Tags</div>
                    <div className="text-foreground font-medium">{article.tags.length}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-cti-800 border border-cti-600 rounded-lg p-5">
                <h3 className="font-semibold text-foreground mb-4">🔗 Related Intelligence</h3>
                <div className="space-y-3">
                  {relatedArticles.map((related) => (
                    <a
                      key={related.id}
                      href={`/actualities/${related.id}`}
                      className="block group"
                    >
                      <div className="text-sm font-medium text-foreground group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                        {related.title}
                      </div>
                      <div className="text-xs text-text-tertiary">{related.severity}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Share/Back */}
            <div className="flex flex-col gap-2">
              <Link
                href="/actualities"
                className="w-full px-4 py-2 rounded-lg bg-cti-800 border border-cti-600 text-center text-foreground hover:bg-cti-700 transition-colors font-medium"
              >
                ← Back to Feed
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
