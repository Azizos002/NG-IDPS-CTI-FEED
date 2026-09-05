'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Newspaper, ShieldAlert, Zap } from 'lucide-react';
import { NewsCategory, NewsItem } from '@/types/news';

const SCENARIO_A: Omit<NewsItem, 'id' | 'createdAt'> = {
  title: 'Critical Phishing Alert: Fake Microsoft 365 Login Portals',
  category: 'AWARENESS',
  summary:
    'Employees must complete immediate awareness refresh training. Fake Microsoft 365 login portals are being used to harvest credentials in the laboratory exercise.',
  content:
    'Do not enter credentials on unsolicited Microsoft 365 pages. Verify the URL through the official portal bookmark, report the message to the SOC, and complete the mandatory phishing awareness module before end of shift. This notice is an NG-IDPS demonstration awareness injection.',
  iocs: ['login.microsoftonline.secure-mail.example', 'm365-sso-verify.example'],
};

const SCENARIO_B: Omit<NewsItem, 'id' | 'createdAt'> = {
  title: 'Active RCE Exploit Detected on Port 8080',
  category: 'CRITICAL_ATTACK',
  summary:
    'NG-IDPS sensors observed unauthenticated remote code execution attempts targeting an internal service on TCP/8080.',
  content:
    'Treat host 192.168.1.105 as hostile in this laboratory scenario. Isolate the affected service, review application logs around the 8080 listener, and stage the proposed Suricata signature for analyst validation. This is demonstration CTI for live defense drills, not a real-world campaign.',
  iocs: ['192.168.1.105', 'CVE-2026-8890'],
  proposed_suricata_rule:
    'alert tcp $EXTERNAL_NET any -> $HOME_NET 8080 (msg:"EXPLOIT RCE Attempt"; content:"|2f 636d64|"; sid:1000001; rev:1;)',
};

export default function PublishPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NewsCategory>('AWARENESS');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [iocsInput, setIocsInput] = useState('');
  const [rule, setRule] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function applyPreset(preset: Omit<NewsItem, 'id' | 'createdAt'>) {
    setTitle(preset.title);
    setCategory(preset.category);
    setSummary(preset.summary);
    setContent(preset.content);
    setIocsInput(preset.iocs.join(', '));
    setRule(preset.proposed_suricata_rule || '');
    setError('');
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    if (content.trim().length < 10) {
      setError('Content must be at least 10 characters.');
      return;
    }

    setSaving(true);
    const item: NewsItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      summary: summary.trim(),
      content: content.trim(),
      iocs: iocsInput
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      proposed_suricata_rule: rule.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/v1/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Failed to save article to SQLite.');
        setSaving(false);
        return;
      }
      router.push('/');
    } catch {
      setError('Failed to reach the local CTI database.');
      setSaving(false);
    }
  }

  const field =
    'w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-cyan-300 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to feed
          </Link>
          <h1 className="text-lg font-semibold text-slate-100">Publish Security News</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-6 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-100">Scenario Preset Injectors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => applyPreset(SCENARIO_A)}
              className="text-left px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400"
            >
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-mono mb-1">
                <Newspaper className="h-3.5 w-3.5" />
                AWARENESS
              </div>
              <div className="text-sm font-medium text-slate-100">Inject Scenario A (Phishing Awareness)</div>
            </button>
            <button
              type="button"
              onClick={() => applyPreset(SCENARIO_B)}
              className="text-left px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-400"
            >
              <div className="inline-flex items-center gap-1.5 text-red-400 text-xs font-mono mb-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                CRITICAL ATTACK
              </div>
              <div className="text-sm font-medium text-slate-100">Inject Scenario B (Zero-Day RCE Attack)</div>
            </button>
          </div>
        </section>

        <form onSubmit={handlePublish} className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} placeholder="News title" />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as NewsCategory)} className={field}>
              <option value="AWARENESS">AWARENESS</option>
              <option value="CRITICAL_ATTACK">CRITICAL_ATTACK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Summary</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className={field} placeholder="Short summary" />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className={field} placeholder="Full notice" />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">IOCs (comma-separated)</label>
            <input
              value={iocsInput}
              onChange={(e) => setIocsInput(e.target.value)}
              className={`${field} font-mono text-sm`}
              placeholder="192.168.1.105, CVE-2026-8890"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Proposed Suricata rule (optional)</label>
            <textarea
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              rows={3}
              className={`${field} font-mono text-xs`}
              placeholder="alert tcp ..."
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-medium disabled:opacity-60"
          >
            {saving ? 'Publishing...' : 'Publish News'}
          </button>
        </form>
      </main>
    </div>
  );
}
