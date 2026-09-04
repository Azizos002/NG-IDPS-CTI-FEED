"use client";
import Layout from '@/components/Layout';
import { useState } from 'react';
import { Actuality } from '@/models/actuality';
import SeverityBadge from '@/components/SeverityBadge';

function simpleMarkdownToHtml(md: string) {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let out = escape(md)
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="bg-cti-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
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

  return (
    <Layout currentPage="/publish">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-heading-lg text-foreground mb-2">Publish Intelligence Report</h1>
        <p className="text-text-secondary">Create and publish cybersecurity threat intelligence or awareness content</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Editor */}
        <div className="space-y-6">
          <div className="bg-cti-800 border border-cti-600 rounded-lg p-6">
            <h2 className="text-heading-sm text-foreground mb-6 pb-3 border-b border-cti-600">Article Details</h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
                className="w-full px-4 py-2 rounded-lg bg-cti-700 border border-cti-600 text-foreground placeholder-text-tertiary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base"
              />
            </div>

            {/* Summary */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of the threat or awareness topic..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-cti-700 border border-cti-600 text-foreground placeholder-text-tertiary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base resize-none"
              />
            </div>

            {/* Type and Severity */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Threat Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'TECHNICAL_THREAT' | 'AWARENESS')}
                  className="w-full px-4 py-2 rounded-lg bg-cti-700 border border-cti-600 text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base"
                >
                  <option value="TECHNICAL_THREAT">Technical Threat</option>
                  <option value="AWARENESS">Awareness</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'|'INFO')}
                  className="w-full px-4 py-2 rounded-lg bg-cti-700 border border-cti-600 text-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                  <option value="INFO">Info</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Content (Markdown)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full article content. Supports Markdown syntax."
                rows={12}
                className="w-full px-4 py-2 rounded-lg bg-cti-700 border border-cti-600 text-foreground placeholder-text-tertiary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base font-mono text-sm resize-none"
              />
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Tags (comma separated)</label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., phishing, ransomware, malware"
                className="w-full px-4 py-2 rounded-lg bg-cti-700 border border-cti-600 text-foreground placeholder-text-tertiary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base"
              />
            </div>

            {/* IOCs */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">IOCs (comma separated)</label>
              <input
                value={iocsInput}
                onChange={(e) => setIocsInput(e.target.value)}
                placeholder="e.g., 192.168.1.1, example.com, http://malicious.site"
                className="w-full px-4 py-2 rounded-lg bg-cti-700 border border-cti-600 text-foreground placeholder-text-tertiary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-base"
              />
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mb-4 p-4 rounded-lg bg-red-600/10 border border-red-600/30">
                <div className="text-sm font-medium text-red-400 mb-2">Validation errors:</div>
                <ul className="text-sm text-red-300 space-y-1">
                  {errors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-cti-600">
              <button
                onClick={() => submitAs('DRAFT')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-cti-700 border border-cti-600 text-foreground hover:bg-cti-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-blue-500 border-text-tertiary rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>💾 Save as Draft</span>
                )}
              </button>
              <button
                onClick={() => submitAs('PUBLISHED')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-white border-green-700 rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>🚀 Publish</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="sticky top-20 h-fit">
          <div className="bg-cti-800 border border-cti-600 rounded-lg p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="text-heading-sm text-foreground mb-6 pb-3 border-b border-cti-600">Live Preview</h2>

            {title || summary || content ? (
              <article className="space-y-4">
                {/* Preview Badges */}
                {(type || severity) && (
                  <div className="flex flex-wrap gap-2">
                    <SeverityBadge severity={severity} size="sm" />
                    <span className="text-xs font-medium text-text-secondary bg-cti-700 px-2.5 py-1 rounded">
                      {getThreatTypeLabel(type)}
                    </span>
                  </div>
                )}

                {/* Preview Title */}
                {title && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground leading-snug">{title}</h3>
                  </div>
                )}

                {/* Preview Summary */}
                {summary && (
                  <p className="text-sm text-text-secondary leading-relaxed border-l-4 border-blue-500 pl-3">
                    {summary}
                  </p>
                )}

                {/* Preview Content */}
                {content && (
                  <div
                    className="text-sm text-text-secondary leading-relaxed space-y-2 article-content prose-sm"
                    dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(content) }}
                  />
                )}

                {/* Preview Tags */}
                {tagsInput && (
                  <div className="pt-4 border-t border-cti-700">
                    <div className="flex flex-wrap gap-1.5">
                      {parseTags(tagsInput).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-cti-700 text-text-tertiary">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview IOCs */}
                {iocsInput && (
                  <div className="pt-4 border-t border-cti-700">
                    <div className="text-xs font-medium text-text-tertiary mb-2 uppercase">IOCs</div>
                    <div className="space-y-1.5">
                      {parseIocs(iocsInput).map((ioc, idx) => (
                        <div key={idx} className="text-xs font-mono bg-cti-700 px-2.5 py-1.5 rounded text-blue-300">
                          {ioc.type}: {ioc.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-text-tertiary">Your article preview will appear here as you write.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
