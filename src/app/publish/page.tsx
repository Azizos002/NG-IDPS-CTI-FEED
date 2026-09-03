"use client";
import Layout from '@/components/Layout';
import { useState } from 'react';
import { Actuality } from '@/models/actuality';

function simpleMarkdownToHtml(md: string) {
  // Very small, safe-ish markdown -> html for preview only
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  let out = escape(md)
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\n\n+/gim, '</p><p>')
    .replace(/\n/gim, '<br/>');
  out = '<p>' + out + '</p>';
  return out;
}

export default function Page() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'TECHNICAL_THREAT' | 'AWARENESS'>('TECHNICAL_THREAT');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'>('MEDIUM');
  const [tagsInput, setTagsInput] = useState('');
  const [iocsInput, setIocsInput] = useState('');
  const [preview, setPreview] = useState(false);
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
    return s
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function parseIocs(s: string) {
    return s
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)
      .map((v) => {
        // naive IOc detection: contains digits -> ip/hash/url heuristics
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
        alert(status === 'PUBLISHED' ? 'Published.' : 'Saved as draft.');
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

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Publish Actuality</h2>
      <form className="space-y-4 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded bg-white/5 p-2" />
        </div>

        <div>
          <label className="block text-sm">Summary</label>
          <input value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full rounded bg-white/5 p-2" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm">Content (Markdown)</label>
            <div className="text-sm">
              <label className="mr-2">
                <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} /> Preview
              </label>
            </div>
          </div>
          {!preview ? (
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="w-full rounded bg-white/5 p-2" />
          ) : (
            <div className="prose max-w-none rounded bg-zinc-900 p-4" dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(content) }} />
          )}
        </div>

        <div className="flex gap-2">
          <select value={type} onChange={(e) => setType(e.target.value as 'TECHNICAL_THREAT' | 'AWARENESS')} className="rounded bg-white/5 p-2">
            <option value="TECHNICAL_THREAT">TECHNICAL_THREAT</option>
            <option value="AWARENESS">AWARENESS</option>
          </select>

          <select value={severity} onChange={(e) => setSeverity(e.target.value as 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'|'INFO')} className="rounded bg-white/5 p-2">
            <option>CRITICAL</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
            <option>INFO</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Tags (comma separated)</label>
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full rounded bg-white/5 p-2" />
        </div>

        <div>
          <label className="block text-sm">IOCs / Tags (comma separated)</label>
          <input value={iocsInput} onChange={(e) => setIocsInput(e.target.value)} className="w-full rounded bg-white/5 p-2" />
        </div>

        {errors.length > 0 && (
          <div className="text-sm text-red-400">
            {errors.map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-foreground text-background flex items-center gap-2" onClick={() => submitAs('DRAFT')} disabled={saving}>
            {saving ? <span className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" /> : null}
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>
          <button className="px-4 py-2 rounded bg-green-600 flex items-center gap-2" onClick={() => submitAs('PUBLISHED')} disabled={saving}>
            {saving ? <span className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" /> : null}
            <span>{saving ? (/* publish in progress */ 'Saving...') : 'Publish'}</span>
          </button>
        </div>
      </form>
    </Layout>
  );
}
