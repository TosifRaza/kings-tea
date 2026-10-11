import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Save } from 'lucide-react';
import api from '../services/api';

const starter = {
  announcement: { enabled: false, text: '', href: '' },
  sections: [
    { key: 'hero', enabled: true, sortOrder: 0, settings: { heading: 'THE ART OF ROYAL TEA', description: 'Discover carefully selected teas for your everyday rituals.', primaryLabel: 'Explore Collection', primaryHref: '/shop', secondaryLabel: 'Discover Tea Culture', secondaryHref: '/culture', slides: [] } },
    { key: 'brandStory', enabled: true, sortOrder: 1, settings: { eyebrow: 'Our Heritage', heading: 'A Legacy Brewed', highlight: 'Through Generations', paragraphOne: 'Explore teas selected for their distinctive origins, aromas, and character.', paragraphTwo: 'Every tea offers its own way to slow down and enjoy the moment.', image: '/images/tea-craftsmanship.png', imageAlt: 'Tea leaves and tea craftsmanship' } },
    { key: 'collections', enabled: true, sortOrder: 2, settings: {} },
    { key: 'bestSellers', enabled: true, sortOrder: 3, settings: {} },
    { key: 'culture', enabled: true, sortOrder: 4, settings: {} },
    { key: 'subscriptions', enabled: true, sortOrder: 5, settings: {} },
    { key: 'testimonials', enabled: true, sortOrder: 6, settings: {} },
    { key: 'newsletter', enabled: true, sortOrder: 7, settings: {} },
    { key: 'teaFinder', enabled: false, sortOrder: 8, settings: {} },
  ],
};

export default function HomepageContentPage() {
  const [json, setJson] = useState(JSON.stringify(starter, null, 2));
  const [published, setPublished] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/site-content/admin/homepage').then(({ data }) => {
      const record = data?.data;
      if (record?.content) setJson(JSON.stringify(record.content, null, 2));
      setPublished(Boolean(record?.published));
    }).catch(() => setError('Could not load saved homepage settings.')).finally(() => setLoading(false));
  }, []);

  const save = async (publish) => {
    setError(''); setStatus('');
    let content;
    try { content = JSON.parse(json); } catch (parseError) { setError(`Invalid JSON: ${parseError.message}`); return; }
    try {
      const { data } = await api.put('/site-content/admin/homepage', { content, published: publish });
      setPublished(Boolean(data?.data?.published));
      setStatus(publish ? 'Homepage published.' : 'Draft saved. Public page is unchanged.');
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save homepage settings.'); }
  };

  return <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
    <header><h1 className="text-2xl font-semibold text-gray-900">Homepage content</h1><p className="mt-1 text-sm text-gray-500">Edit the published sections and ordering. Section keys must match supported storefront modules. Image paths should point to durable media URLs.</p></header>
    <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${published ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
      {published ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}{published ? 'A homepage configuration is published.' : 'No homepage configuration is published; the storefront currently uses its built-in layout.'}
    </div>
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {status && <p role="status" className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p>}
    <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700">Homepage JSON</span><textarea value={json} onChange={(event) => setJson(event.target.value)} spellCheck="false" disabled={loading} className="min-h-[65vh] w-full rounded-lg border border-gray-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-60" /></label>
    <p className="text-xs text-gray-500">Supported section keys: hero, brandStory, collections, bestSellers, culture, subscriptions, testimonials, newsletter, teaFinder. Each section has enabled, sortOrder, and optional settings. Save a draft first; publish only after review.</p>
    <div className="flex flex-wrap gap-3"><button onClick={() => save(false)} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"><Save size={16} />Save draft</button><button onClick={() => save(true)} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50">Publish homepage</button></div>
  </div>;
}
