"use client";
import React from 'react';
import SiteHeader from './SiteHeader';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage }: LayoutProps) {
  return (
    <div className="min-h-screen bg-cti-950 text-foreground flex flex-col">
      <SiteHeader currentPage={currentPage} />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t border-cti-600 bg-cti-900 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-text-tertiary">
          <p>NG-IDPS CTI Feed • Laboratory Threat Intelligence Distribution</p>
          <p className="mt-2 text-xs text-text-tertiary">This is a controlled demonstration feed for cybersecurity threat intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
