"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  return (
    <header className="border-b border-cti-600 bg-cti-800 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 py-4">
        {/* Top row: Logo + Search */}
        <div className="flex items-center justify-between gap-6 mb-4">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-base">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center font-bold text-white text-sm">
              CTI
            </div>
            <div>
              <div className="font-semibold text-foreground">NG-IDPS</div>
              <div className="text-xs text-text-secondary">Threat Intelligence</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search intelligence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded bg-cti-700 border border-cti-600 text-foreground placeholder-text-tertiary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base"
              aria-label="Search actualities"
            />
          </form>

          {/* Status Badge */}
          <div className="text-xs text-text-secondary flex items-center gap-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Lab Feed</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto">
          <Link
            href="/"
            className={`px-4 py-2 rounded transition-base whitespace-nowrap ${
              isActive('/')
                ? 'bg-blue-600 text-white'
                : 'text-text-secondary hover:text-foreground hover:bg-cti-700'
            }`}
          >
            Home
          </Link>
          <Link
            href="/actualities"
            className={`px-4 py-2 rounded transition-base whitespace-nowrap ${
              isActive('/actualities')
                ? 'bg-blue-600 text-white'
                : 'text-text-secondary hover:text-foreground hover:bg-cti-700'
            }`}
          >
            Actualités
          </Link>
          <Link
            href="/publish"
            className={`px-4 py-2 rounded transition-base whitespace-nowrap ${
              isActive('/publish')
                ? 'bg-blue-600 text-white'
                : 'text-text-secondary hover:text-foreground hover:bg-cti-700'
            }`}
          >
            Publish
          </Link>
          <Link
            href="/manage"
            className={`px-4 py-2 rounded transition-base whitespace-nowrap ${
              isActive('/manage')
                ? 'bg-blue-600 text-white'
                : 'text-text-secondary hover:text-foreground hover:bg-cti-700'
            }`}
          >
            Manage
          </Link>
          <Link
            href="/api/v1/feed"
            className="px-4 py-2 rounded text-text-secondary hover:text-foreground hover:bg-cti-700 transition-base whitespace-nowrap text-sm"
          >
            API / Feed
          </Link>
        </nav>
      </div>
    </header>
  );
}
