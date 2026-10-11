import { useEffect, useState } from 'react';
import api from '../services/api';

const CONTENT_KEYS = ['faq', 'policies', 'navigation', 'footer', 'brand-story', 'brewing-guides', 'store-settings'];
const blank = { faq: { categories: [], items: [] }, policies: { pages: [] }, navigation: { links: [] }, footer: { columns: [], socials: [] }, 'brand-story': { heading: '', paragraphs: [], image: '', imageAlt: '' }, 'brewing-guides': { articles: [] }, 'store-settings': { currency: 'INR', contactEmail: '', phone: '', socials: [] } };

export default function SiteContentManagementPage() {
  const [key, setKey] = useState(CONTENT_KEYS[0]);
  const [json, setJson] = useState(JSON.stringify(blank.faq, null, 2));
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const load = async (nextKey = key) => {
    setError(''); setMessage('');
    try { const { data } = await api.get(`/site-content/admin/${nextKey}`); setJson(JSON.stringify(data?.data?.content || blank[nextKey], null, 2)); setPublished(Boolean(data?.data?.published)); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load content.'); }
  };
  useEffect(() => { load(key); }, [key]);
  const save = async (publish) => {
    let content;
    try { content = JSON.parse(json); } catch (parseError) { setError(`Invalid JSON: ${parseError.message}`); return; }
    try { const { data } = await api.put(`/site-content/admin/${key}`, { content, published: publish }); setPublished(Boolean(data?.data?.published)); setMessage(publish ? 'Content published.' : 'Draft saved.'); setError(''); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save content.'); }
  };
  return <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
    <header><h1 className="text-2xl font-semibold">Site content</h1><p className="text-sm text-gray-600">Draft/publish structured FAQ, policies, navigation, footer, brand story, guides, and store settings. Public APIs expose published records only.</p></header>
    <div className="flex flex-wrap gap-2">{CONTENT_KEYS.map((item) => <button key={item} onClick={() => setKey(item)} className={`rounded-full px-4 py-2 text-sm capitalize ${item === key ? 'bg-emerald-900 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200'}`}>{item.replaceAll('-', ' ')}</button>)}</div>
    <p className="text-sm">Status: {published ? 'Published' : 'Draft'}</p>
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-emerald-800">{message}</p>}
    <textarea aria-label={`${key} content JSON`} value={json} onChange={(event) => setJson(event.target.value)} spellCheck="false" className="min-h-[60vh] w-full rounded-lg border bg-slate-950 p-4 font-mono text-xs leading-5 text-emerald-100" />
    <div className="flex gap-3"><button onClick={() => save(false)} className="rounded border px-4 py-2">Save draft</button><button onClick={() => save(true)} className="rounded bg-emerald-900 px-4 py-2 text-white">Publish</button></div>
  </div>;
}
