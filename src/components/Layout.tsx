"use client";
import React from 'react';
import SiteHeader from './SiteHeader';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col custom-scrollbar">
      <SiteHeader currentPage={currentPage} />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
      <footer className="border-t border-slate-800 bg-slate-900/60 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-slate-500">
          <p className="font-medium text-slate-400">NG-IDPS CTI Feed • Laboratory Threat Intelligence Distribution</p>
          <p className="mt-2 text-xs font-mono">SOC COMMAND SURFACE // CONTROLLED DEMONSTRATION FEED</p>
        </div>
      </footer>
    </div>
  );
}
