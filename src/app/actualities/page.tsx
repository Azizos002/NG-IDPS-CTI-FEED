import Layout from '@/components/Layout';
import ActualityList from '@/components/ActualityList';
import { readSeed } from '@/lib/seed';

export default function Page() {
  const { actualities } = readSeed();
  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Actualities</h2>
      <ActualityList items={actualities} />
    </Layout>
  );
}
