import Layout from '@/components/Layout';
import { readSeed } from '@/lib/seed';
import { notFound } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  const { actualities } = readSeed();
  const a = actualities.find((x) => x.id === params.id || x.slug === params.id);
  if (!a) return notFound();
  return (
    <Layout>
      <article className="prose prose-invert max-w-none">
        <h2>{a.title}</h2>
        <p className="text-zinc-300">{a.summary}</p>
        <div className="mt-4">
          <strong>Severity:</strong> {a.severity}
        </div>
        <div className="mt-4">
          <h3>Indicators</h3>
          <ul>
            {a.iocs?.map((ioc, idx) => (
              <li key={idx}>{ioc.type}: {ioc.value}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6 prose">
          <p>{a.content}</p>
        </div>
      </article>
    </Layout>
  );
}
