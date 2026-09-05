"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Database, Filter, Globe, ShieldAlert, Terminal } from 'lucide-react';

interface SiteHeaderProps {
  currentPage?: string;
}

export default function SiteHeader({ currentPage }: SiteHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/actualities?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => currentPage === path;

  const navLink = (path: string, label: string) =>
    `px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-base ${
      isActive(path)
        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent'
    }`;

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-6 mb-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 hover:opacity-90 transition-base">
            <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,211,238,0.25)]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold tracking-tight text-slate-100">NG-IDPS</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-400/80">Threat Intelligence</div>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by IP, hash, domain, or CVE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-base font-mono text-sm"
                aria-label="Search actualities"
              />
            </div>
          </form>

          <div className="text-xs text-slate-400 flex items-center gap-2 flex-shrink-0 font-mono">
            <span className="live-pulse inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-400">LIVE FEED</span>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
          <Link href="/" className={navLink('/')}>
            <span className="inline-flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" />Home</span>
          </Link>
          <Link href="/actualities" className={navLink('/actualities')}>
            <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />CTI Feed</span>
          </Link>
          <Link href="/publish" className={navLink('/publish')}>
            <span className="inline-flex items-center gap-1.5"><Terminal className="h-3.5 w-3.5" />Publish</span>
          </Link>
          <Link href="/manage" className={navLink('/manage')}>
            <span className="inline-flex items-center gap-1.5"><Database className="h-3.5 w-3.5" />Manage</span>
          </Link>
          <Link
            href="/api/v1/feed"
            className="px-3 py-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-base whitespace-nowrap text-sm font-mono"
          >
            API / Feed
          </Link>
        </nav>
      </div>
    </header>
  );
}
