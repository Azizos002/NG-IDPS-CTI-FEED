import React from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cti text-zinc-100">
      <div className="max-w-8xl mx-auto px-6 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/10 rounded flex items-center justify-center font-bold">CTI</div>
            <h1 className="text-xl font-semibold">NG‑IDPS CTI Feed</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="px-3 py-1 rounded hover:bg-white/5" href="/">Dashboard</Link>
            <Link className="px-3 py-1 rounded hover:bg-white/5" href="/actualities">Actualities</Link>
            <Link className="px-3 py-1 rounded hover:bg-white/5" href="/publish">Publish</Link>
            <Link className="px-3 py-1 rounded hover:bg-white/5" href="/manage">Manage</Link>
            <Link className="px-3 py-1 rounded hover:bg-white/5" href="/api/v1/feed">Feed</Link>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
