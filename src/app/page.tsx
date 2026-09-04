import Layout from '@/components/Layout';
import { readSeed } from '@/lib/seed';
import ArticleCard from '@/components/ArticleCard';

function StatsSummary({ total, critical, high, updated }: { total: number; critical: number; high: number; updated: string }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-12">
      <div className="bg-cti-800 border border-cti-600 rounded-lg p-4">
        <div className="text-sm text-text-tertiary mb-1">Total Reports</div>
        <div className="text-2xl font-bold text-foreground">{total}</div>
      </div>
      <div className="bg-cti-800 border border-cti-600 rounded-lg p-4">
        <div className="text-sm text-red-400 mb-1">🔴 Critical</div>
        <div className="text-2xl font-bold text-red-300">{critical}</div>
      </div>
      <div className="bg-cti-800 border border-cti-600 rounded-lg p-4">
        <div className="text-sm text-orange-400 mb-1">🟠 High</div>
        <div className="text-2xl font-bold text-orange-300">{high}</div>
      </div>
      <div className="bg-cti-800 border border-cti-600 rounded-lg p-4">
        <div className="text-sm text-text-tertiary mb-1">Last Updated</div>
        <div className="text-sm font-medium text-foreground">{updated}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const { actualities } = readSeed();
  const published = actualities.filter((a) => a.status === 'PUBLISHED');
  const featured = published[0];
  const latest = published.slice(0, 10);
  const critical = published.filter((a) => a.severity === 'CRITICAL');
  const high = published.filter((a) => a.severity === 'HIGH');

  return (
    <Layout currentPage="/">
      {/* Hero Section */}
      {featured ? (
        <section className="mb-12">
          <ArticleCard article={featured} featured={true} />
        </section>
      ) : null}

      {/* Stats Summary */}
      <StatsSummary 
        total={published.length} 
        critical={critical.length}
        high={high.length}
        updated={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      />

      {/* Latest Intelligence Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-heading-lg text-foreground mb-2">Latest Threat Intelligence</h2>
          <p className="text-text-secondary">The most recent cybersecurity and threat intelligence reports</p>
        </div>
        <div className="space-y-4">
          {latest.length > 0 ? (
            latest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <p>No published intelligence yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
