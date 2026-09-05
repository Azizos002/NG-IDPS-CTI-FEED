"use client";
import Layout from '@/components/Layout';
import { useState } from 'react';
import { Actuality } from '@/models/actuality';
import SeverityBadge from '@/components/SeverityBadge';
import { Terminal } from 'lucide-react';

function simpleMarkdownToHtml(md: string) {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let out = escape(md)
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="bg-slate-950 px-1.5 py-0.5 rounded text-sm font-mono text-cyan-300">$1</code>')
    .replace(/\n\n+/gim, '</p><p class="mb-4">')
    .replace(/\n/gim, '<br/>');
  out = '<p class="mb-4">' + out + '</p>';
  return out;
}

export default function PublishPage() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'TECHNICAL_THREAT' | 'AWARENESS'>('TECHNICAL_THREAT');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'>('MEDIUM');
  const [tagsInput, setTagsInput] = useState('');
  const [iocsInput, setIocsInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function validate() {
    const err: string[] = [];
    if (!title || title.trim().length < 3) err.push('Title must be at least 3 characters');
    if (!content || content.trim().length < 10) err.push('Content must be at least 10 characters');
    setErrors(err);
    return err.length === 0;
  }

  function parseTags(s: string) {
    return s.split(',').map((t) => t.trim()).filter(Boolean);
  }

  function parseIocs(s: string) {
    return s
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => {
        const lower = v.toLowerCase();
        if (/^\d+\.\d+\.\d+\.\d+/.test(v)) return { type: 'ip', value: v };
        if (lower.startsWith('http')) return { type: 'url', value: v };
        if (v.includes('@')) return { type: 'email', value: v };
        return { type: 'other', value: v };
      });
  }

  async function submitAs(status: 'DRAFT' | 'PUBLISHED') {
    if (!validate()) return;
    setSaving(true);
    const now = new Date().toISOString();
    const item: Partial<Actuality> = {
      title,
      summary,
      content,
      type,
      severity,
      status,
      publishedAt: status === 'PUBLISHED' ? now : undefined,
      tags: parseTags(tagsInput),
      iocs: parseIocs(iocsInput),
      references: [],
      createdAt: now,
      createdBy: 'local-user',
    };

    try {
      const res = await fetch('/api/v1/actualities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        setTitle('');
        setSummary('');
        setContent('');
        setTagsInput('');
        setIocsInput('');
        setErrors([]);
        alert(status === 'PUBLISHED' ? 'Published successfully!' : 'Saved as draft.');
      } else {
        const json = await res.json().catch(() => ({}));
        alert('Failed to save: ' + (json?.error || res.statusText));
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving actuality');
    } finally {
      setSaving(false);
    }
  }

  const getThreatTypeLabel = (type: string) => {
    return type === 'TECHNICAL_THREAT' ? 'Technical Threat' : 'Awareness';
  };

  const fieldClass =
    'w-full px-4 py-2 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-base';

  return (
    <Layout currentPage="/publish">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400">
          <Terminal className="h-3.5 w-3.5" />
          Analyst Console
        </div>
        <h1 className="text-heading-lg text-slate-100 mb-2">Publish Intelligence Report</h1>
        <p className="text-slate-400">Create and publish cybersecurity threat intelligence or awareness content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <h2 className="text-heading-sm text-slate-100 mb-6 pb-3 border-b border-slate-800">Article Details</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter article title..." className={fieldClass} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of the threat or awareness topic..."
                rows={3}
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Threat Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'TECHNICAL_THREAT' | 'AWARENESS')}
                  className={fieldClass}
                >
                  <option value="TECHNICAL_THREAT">Technical Threat</option>
                  <option value="AWARENESS">Awareness</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'|'INFO')}
                  className={fieldClass}
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="INFO">Info</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">Content (Markdown)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full article content. Supports Markdown syntax."
                rows={12}
                className={`${fieldClass} font-mono text-sm resize-none`}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">Tags (comma separated)</label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., phishing, ransomware, malware"
                className={fieldClass}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">IOCs (comma separated)</label>
              <input
                value={iocsInput}
                onChange={(e) => setIocsInput(e.target.value)}
                placeholder="e.g., 192.0.2.1, example.com, http://malicious.site"
                className={`${fieldClass} font-mono`}
              />
            </div>

            {errors.length > 0 && (
              <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="text-sm font-medium text-red-400 mb-2">Validation errors:</div>
                <ul className="text-sm text-red-300 space-y-1">
                  {errors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => submitAs('DRAFT')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-100 hover:border-slate-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                onClick={() => submitAs('PUBLISHED')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        <div className="sticky top-24 h-fit">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-xl p-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <h2 className="text-heading-sm text-slate-100 mb-6 pb-3 border-b border-slate-800">Live Preview</h2>

            {title || summary || content ? (
              <article className="space-y-4">
                {(type || severity) && (
                  <div className="flex flex-wrap gap-2">
                    <SeverityBadge severity={severity} size="sm" />
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded">
                      {getThreatTypeLabel(type)}
                    </span>
                  </div>
                )}

                {title && (
                  <h3 className="text-lg font-semibold text-slate-100 leading-snug">{title}</h3>
                )}

                {summary && (
                  <p className="text-sm text-slate-400 leading-relaxed border-l-4 border-cyan-400 pl-3">
                    {summary}
                  </p>
                )}

                {content && (
                  <div
                    className="text-sm text-slate-400 leading-relaxed space-y-2 article-content prose-sm"
                    dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(content) }}
                  />
                )}

                {tagsInput && (
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex flex-wrap gap-1.5">
                      {parseTags(tagsInput).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {iocsInput && (
                  <div className="pt-4 border-t border-slate-800">
                    <div className="text-xs font-medium text-slate-500 mb-2 uppercase font-mono">IOCs</div>
                    <div className="space-y-1.5">
                      {parseIocs(iocsInput).map((ioc, idx) => (
                        <div key={idx} className="text-xs font-mono bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 rounded text-cyan-300">
                          {ioc.type}: {ioc.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">Your article preview will appear here as you write.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
