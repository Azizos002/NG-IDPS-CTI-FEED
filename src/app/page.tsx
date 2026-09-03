import Layout from '@/components/Layout';
import { readSeed } from '@/lib/seed';
import ActualityList from '@/components/ActualityList';

export default function Home() {
  const { actualities } = readSeed();
  const recent = actualities.filter(a => a.status === 'PUBLISHED').slice(0,6);
  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2">Recent published</h3>
        <ActualityList items={recent} />
      </section>
      <section>
        <h3 className="text-lg font-medium mb-2">All actualities</h3>
        <ActualityList items={actualities.slice(0,8)} />
      </section>
    </Layout>
  );
}
