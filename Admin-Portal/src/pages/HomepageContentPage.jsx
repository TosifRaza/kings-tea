import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Save } from 'lucide-react';
import api from '../services/api';

const starter = {
  announcement: { enabled: false, text: '', href: '' },
  sections: [
    { key: 'hero', enabled: true, sortOrder: 0, settings: { heading: 'THE ART OF ROYAL TEA', description: 'Discover carefully selected teas for your everyday rituals.', primaryLabel: 'Explore Collection', primaryHref: '/shop', secondaryLabel: 'Discover Tea Culture', secondaryHref: '/culture', slides: [] } },
    { key: 'benefits', enabled: true, sortOrder: 1, settings: {} },
    { key: 'categories', enabled: true, sortOrder: 2, settings: {} },
    { key: 'collections', enabled: true, sortOrder: 3, settings: {} },
    { key: 'bestSellers', enabled: true, sortOrder: 4, settings: {} },
    { key: 'newArrivals', enabled: true, sortOrder: 5, settings: {} },
    { key: 'teaFinder', enabled: true, sortOrder: 6, settings: {} },
    { key: 'moods', enabled: true, sortOrder: 7, settings: {} },
    { key: 'brandStory', enabled: true, sortOrder: 8, settings: { eyebrow: 'Our Heritage', heading: 'A Legacy Brewed', highlight: 'Through Generations', paragraphOne: 'Explore teas selected for their distinctive origins, aromas, and character.', paragraphTwo: 'Every tea offers its own way to slow down and enjoy the moment.', image: '/images/tea-craftsmanship.png', imageAlt: 'Tea leaves and tea craftsmanship' } },
    { key: 'gifts', enabled: true, sortOrder: 9, settings: {} },
    { key: 'customerReviews', enabled: true, sortOrder: 10, settings: {} },
    { key: 'culture', enabled: true, sortOrder: 11, settings: {} },
    { key: 'brewingGuides', enabled: true, sortOrder: 12, settings: {} },
    { key: 'subscriptions', enabled: true, sortOrder: 13, settings: {} },
    { key: 'testimonials', enabled: true, sortOrder: 14, settings: {} },
    { key: 'faq', enabled: true, sortOrder: 15, settings: {} },
    { key: 'customerTrust', enabled: true, sortOrder: 16, settings: {} },
    { key: 'newsletter', enabled: true, sortOrder: 17, settings: {} },
  ],
};

const mergeHomepageDefaults = (content = {}) => {
  const configured = Array.isArray(content.sections) ? content.sections : [];
  const byKey = new Map(configured.map((section) => [section.key, section]));
  const maxOrder = configured.reduce((max, section) => Math.max(max, Number(section.sortOrder) || 0), -1);
  const missing = starter.sections.filter((section) => !byKey.has(section.key)).map((section, index) => ({ ...section, sortOrder: maxOrder + index + 1 }));
  return { ...starter, ...content, announcement: { ...starter.announcement, ...(content.announcement || {}) }, sections: [...configured, ...missing].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)) };
};

export default function HomepageContentPage() {
  const [json, setJson] = useState(JSON.stringify(starter, null, 2));
  const [published, setPublished] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const homepage = useMemo(() => { try { return JSON.parse(json); } catch { return null; } }, [json]);

  const updateHomepage = (change) => {
    if (!homepage) return;
    setJson(JSON.stringify(change(homepage), null, 2));
    setError('');
  };
  const updateSection = (index, change) => updateHomepage((current) => ({
    ...current,
    sections: current.sections.map((section, position) => position === index ? change(section) : section),
  }));
  const moveSection = (index, offset) => updateHomepage((current) => {
    const sections = [...current.sections];
    const next = index + offset;
    if (next < 0 || next >= sections.length) return current;
    [sections[index], sections[next]] = [sections[next], sections[index]];
    return { ...current, sections: sections.map((section, sortOrder) => ({ ...section, sortOrder })) };
  });

  useEffect(() => {
    api.get('/site-content/admin/homepage').then(({ data }) => {
      const record = data?.data;
      if (record?.content?.sections?.length) setJson(JSON.stringify(mergeHomepageDefaults(record.content), null, 2));
      else setJson(JSON.stringify(starter, null, 2));
      setPublished(Boolean(record?.published));
    }).catch(() => setError('Could not load saved homepage settings.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    api.get('/products', { params: { limit: 100 } }).then(({ data }) => {
      if (active) setCatalogProducts(data?.data?.products || []);
    }).catch(() => {});
    return () => { active = false; };
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

  const sectionLabels = { hero: 'Hero banner', benefits: 'Trust benefits', categories: 'Tea categories', collections: 'Curated collections', bestSellers: 'Most cherished', newArrivals: 'New arrivals', teaFinder: 'Tea finder', moods: 'Tea collections', brandStory: 'Brand story', gifts: 'Gift collection', customerReviews: 'Customer reviews', culture: 'Tea culture', brewingGuides: 'Brewing guides', subscriptions: 'Subscriptions', testimonials: 'Testimonials', faq: 'FAQ', customerTrust: 'Customer information', newsletter: 'Newsletter' };
  return <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
    <header><h1 className="text-2xl font-semibold text-gray-900">Homepage content</h1><p className="mt-1 text-sm text-gray-500">Control public homepage sections, ordering, visibility, and content. Keep products, categories, FAQs, and guides in their existing catalog and content editors.</p></header>
    <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${published ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
      {published ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}{published ? 'A homepage configuration is published.' : 'No homepage configuration is published; the storefront currently uses its built-in layout.'}
    </div>
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {status && <p role="status" className="rounded bg-emerald-50 p-3 text-sm text-emerald-800">{status}</p>}
    {homepage && <>
      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-4"><h2 className="font-semibold text-gray-900">Announcement bar</h2><p className="text-xs text-gray-500">Optional promotion shown above the storefront navigation.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={Boolean(homepage.announcement?.enabled)} onChange={(event) => updateHomepage((current) => ({ ...current, announcement: { ...current.announcement, enabled: event.target.checked } }))} />Show announcement</label>
          <input aria-label="Announcement text" value={homepage.announcement?.text || ''} onChange={(event) => updateHomepage((current) => ({ ...current, announcement: { ...current.announcement, text: event.target.value } }))} placeholder="Announcement text" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input aria-label="Announcement link" value={homepage.announcement?.href || ''} onChange={(event) => updateHomepage((current) => ({ ...current, announcement: { ...current.announcement, href: event.target.value } }))} placeholder="Optional link, e.g. /shop" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <div className="flex gap-3"><label className="flex flex-1 items-center gap-2 text-xs text-gray-600">Background <input type="color" value={homepage.announcement?.backgroundColor || '#173e30'} onChange={(event) => updateHomepage((current) => ({ ...current, announcement: { ...current.announcement, backgroundColor: event.target.value } }))} /></label><label className="flex flex-1 items-center gap-2 text-xs text-gray-600">Text <input type="color" value={homepage.announcement?.textColor || '#ffffff'} onChange={(event) => updateHomepage((current) => ({ ...current, announcement: { ...current.announcement, textColor: event.target.value } }))} /></label></div>
        </div>
      </section>
      <section className="space-y-3">
        <div><h2 className="font-semibold text-gray-900">Homepage sections</h2><p className="text-xs text-gray-500">Turn sections on or off, change their order, and edit the main heading and description.</p></div>
        {[...(homepage.sections || [])].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)).map((section, index, ordered) => {
          const actualIndex = homepage.sections.findIndex((candidate) => candidate.key === section.key);
          const settings = section.settings || {};
          return <article key={section.key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-3"><input type="checkbox" checked={section.enabled !== false} onChange={(event) => updateSection(actualIndex, (item) => ({ ...item, enabled: event.target.checked }))} /><span className="font-medium text-gray-900">{sectionLabels[section.key] || section.key}</span></label>
              <div className="flex gap-1"><button type="button" aria-label={`Move ${sectionLabels[section.key] || section.key} up`} disabled={index === 0} onClick={() => moveSection(actualIndex, -1)} className="rounded border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30"><ArrowUp size={15} /></button><button type="button" aria-label={`Move ${sectionLabels[section.key] || section.key} down`} disabled={index === ordered.length - 1} onClick={() => moveSection(actualIndex, 1)} className="rounded border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30"><ArrowDown size={15} /></button></div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input aria-label={`${sectionLabels[section.key] || section.key} heading`} value={settings.heading || ''} onChange={(event) => updateSection(actualIndex, (item) => ({ ...item, settings: { ...item.settings, heading: event.target.value } }))} placeholder="Heading (uses storefront default when empty)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input aria-label={`${sectionLabels[section.key] || section.key} description`} value={settings.description || ''} onChange={(event) => updateSection(actualIndex, (item) => ({ ...item, settings: { ...item.settings, description: event.target.value } }))} placeholder="Description (optional)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
            {section.key === 'gifts' && <fieldset className="mt-4 rounded-lg border border-gray-200 p-3"><legend className="px-1 text-xs font-medium text-gray-700">Products to feature as gifts</legend>{catalogProducts.length ? <div className="grid gap-2 sm:grid-cols-2">{catalogProducts.map((product) => { const selected = (settings.productIds || []).map(String).includes(String(product._id)); return <label key={product._id} className="flex items-center gap-2 text-xs text-gray-700"><input type="checkbox" checked={selected} onChange={(event) => updateSection(actualIndex, (item) => { const ids = new Set((item.settings?.productIds || []).map(String)); if (event.target.checked) ids.add(String(product._id)); else ids.delete(String(product._id)); return { ...item, settings: { ...item.settings, productIds: [...ids] } }; })} /><span>{product.name}</span></label>; })}</div> : <p className="text-xs text-gray-500">Product choices are unavailable right now.</p>}</fieldset>}
          </article>;
        })}
      </section>
    </>}
    <details className="rounded-xl border border-gray-200 bg-white p-4"><summary className="cursor-pointer text-sm font-medium text-gray-800">Advanced homepage settings (JSON)</summary><label className="mt-3 block"><span className="mb-2 block text-xs text-gray-500">Use this for hero slides, images, and optional module settings.</span><textarea value={json} onChange={(event) => setJson(event.target.value)} spellCheck="false" disabled={loading} className="min-h-[50vh] w-full rounded-lg border border-gray-700 bg-slate-950 p-4 font-mono text-xs leading-5 text-emerald-100 outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-60" /></label></details>
    <p className="text-xs text-gray-500">Supported section keys: hero, benefits, categories, collections, bestSellers, newArrivals, teaFinder, moods, brandStory, gifts, customerReviews, culture, brewingGuides, subscriptions, testimonials, faq, customerTrust, newsletter. Each section has enabled, sortOrder, and optional settings. Unpublished content shows an honest empty state instead of sample business claims.</p>
    <div className="flex flex-wrap gap-3"><button onClick={() => save(false)} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"><Save size={16} />Save draft</button><button onClick={() => save(true)} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50">Publish homepage</button></div>
  </div>;
}
