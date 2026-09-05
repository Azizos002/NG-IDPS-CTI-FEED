import Link from 'next/link';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto text-center py-20 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl px-8">
        <div className="text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase mb-3">404</div>
        <h1 className="text-heading-lg text-slate-100 mb-3">Route not in the CTI surface</h1>
        <p className="text-slate-400 mb-8">The requested path is not a published intelligence console page.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="px-4 py-2 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            Home
          </Link>
          <Link href="/actualities" className="px-4 py-2 rounded-lg border border-slate-800 text-slate-300 hover:border-slate-700">
            CTI Feed
          </Link>
        </div>
      </div>
    </Layout>
  );
}
