import Layout from '@/components/Layout';
import { readSeed } from '@/lib/seed';
import ArticleCard from '@/components/ArticleCard';
import MetricsRibbon from '@/components/MetricsRibbon';
import { collectMetrics } from '@/lib/cti-format';
import { Activity } from 'lucide-react';

export default function Home() {
  const { actualities } = readSeed();
  const published = actualities.filter((a) => a.status === 'PUBLISHED');
  const featured = published[0];
  const latest = published.slice(0, 10);
  const metrics = collectMetrics(published);

  return (
    <Layout currentPage="/">
      <section className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">
            <Activity className="h-3.5 w-3.5" />
            SOC Command Surface
          </div>
          <h1 className="text-display text-slate-100">Cyber Threat Intelligence Feed (CTI)</h1>
          <p className="text-slate-400 mt-2">High-density laboratory feed for IOC ingestion, actor tagging, and analyst workflow.</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
          <span className="live-pulse inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-emerald-400">LIVE FEED / SYNCED</span>
        </div>
      </section>

      <div className="mb-10">
        <MetricsRibbon
          totalIocs={metrics.totalIocs}
          maliciousIps={metrics.maliciousIps}
          threatActors={metrics.threatActors}
          avgConfidence={metrics.avgConfidence}
        />
      </div>

      {featured ? (
        <section className="mb-12">
          <ArticleCard article={featured} featured={true} />
        </section>
      ) : null}

      <section>
        <div className="mb-6">
          <h2 className="text-heading-lg text-slate-100 mb-2">Latest Threat Intelligence</h2>
          <p className="text-slate-400">Most recent published reports from the laboratory CTI pipeline</p>
        </div>
        <div className="space-y-4">
          {latest.length > 0 ? (
            latest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 border border-dashed border-slate-800 rounded-xl">
              <p>No published intelligence yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
