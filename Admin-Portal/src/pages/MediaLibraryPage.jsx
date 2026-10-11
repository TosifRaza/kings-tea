import { useEffect, useState } from 'react';
import api from '../services/api';

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState([]);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [upload, setUpload] = useState({ file: null, altText: '', sourceUrl: '', sourceProvider: 'User upload', licenseReference: '', attribution: '', usage: 'other' });
  const load = async () => {
    setBusy(true);
    try { const { data } = await api.get('/admin/media', { params: { q: query, limit: 60 } }); setAssets(data?.data?.assets || []); setMessage(''); }
    catch (error) { setMessage(error.response?.data?.message || 'Unable to load library.'); }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); }, []);
  const save = async (asset) => {
    try { await api.patch(`/admin/media/${asset._id}`, { altText: asset.altText, sourceUrl: asset.sourceUrl, sourceProvider: asset.sourceProvider, licenseReference: asset.licenseReference, attribution: asset.attribution, usage: asset.usage }); setMessage('Asset metadata saved.'); }
    catch (error) { setMessage(error.response?.data?.message || 'Could not save asset.'); }
  };
  const remove = async (asset) => {
    try { await api.delete(`/admin/media/${asset._id}`); setAssets((items) => items.filter((item) => item._id !== asset._id)); setMessage('Asset deleted.'); }
    catch (error) { setMessage(error.response?.data?.message || 'Could not delete asset.'); }
  };
  const uploadAsset = async (event) => {
    event.preventDefault(); if (!upload.file) return;
    const payload = new FormData();
    Object.entries(upload).forEach(([key, value]) => { if (key === 'file') payload.append('image', value); else payload.append(key, value); });
    try { const { data } = await api.post('/admin/media', payload, { headers: { 'Content-Type': 'multipart/form-data' } }); setAssets((items) => [data.data, ...items]); setUpload({ file: null, altText: '', sourceUrl: '', sourceProvider: 'User upload', licenseReference: '', attribution: '', usage: 'other' }); setMessage('Image uploaded and metadata stored.'); }
    catch (error) { setMessage(error.response?.data?.message || 'Image upload failed.'); }
  };
  return <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
    <header><h1 className="text-2xl font-semibold text-gray-900">Media library</h1><p className="text-sm text-gray-500">Durable Cloudinary product uploads with editable metadata. Product image uploads are automatically associated with their product.</p></header>
    <form onSubmit={uploadAsset} className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
      <input required type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setUpload({ ...upload, file: e.target.files?.[0] || null })} className="text-sm" />
      <input placeholder="Alt text" value={upload.altText} onChange={(e) => setUpload({ ...upload, altText: e.target.value })} className="rounded border px-3 py-2" />
      <select value={upload.usage} onChange={(e) => setUpload({ ...upload, usage: e.target.value })} className="rounded border px-3 py-2"><option value="other">Other</option><option value="category">Category</option><option value="homepage">Homepage</option><option value="content">Content / guides</option><option value="product">Product</option></select>
      <input placeholder="Original source URL" value={upload.sourceUrl} onChange={(e) => setUpload({ ...upload, sourceUrl: e.target.value })} className="rounded border px-3 py-2" />
      <input placeholder="Source provider" value={upload.sourceProvider} onChange={(e) => setUpload({ ...upload, sourceProvider: e.target.value })} className="rounded border px-3 py-2" />
      <input placeholder="License / usage-rights reference" value={upload.licenseReference} onChange={(e) => setUpload({ ...upload, licenseReference: e.target.value })} className="rounded border px-3 py-2" />
      <input placeholder="Attribution" value={upload.attribution} onChange={(e) => setUpload({ ...upload, attribution: e.target.value })} className="rounded border px-3 py-2 sm:col-span-2" />
      <button disabled={!upload.file} className="rounded bg-emerald-800 px-4 py-2 text-white disabled:opacity-50">Upload durable image</button>
    </form>
    <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); load(); }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search filename or alt text" className="min-w-0 flex-1 rounded border px-3 py-2" /><button className="rounded bg-emerald-800 px-4 text-white">Search</button></form>
    {message && <p role="status" className="text-sm text-emerald-800">{message}</p>}
    {busy ? <p>Loading media…</p> : assets.length === 0 ? <p className="rounded bg-white p-6 text-gray-600">No uploaded media assets found.</p> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{assets.map((asset) => <article key={asset._id} className="space-y-2 rounded-xl border bg-white p-3 shadow-sm">
      <img src={asset.url} alt={asset.altText || ''} className="h-44 w-full rounded object-cover" loading="lazy" />
      <div className="text-xs text-gray-500">{asset.width}×{asset.height} · {Math.round((asset.bytes || 0) / 1024)} KB · {asset.mimeType}</div>
      <label className="block text-xs">Alt text<input value={asset.altText || ''} onChange={(event) => setAssets((items) => items.map((item) => item._id === asset._id ? { ...item, altText: event.target.value } : item))} className="mt-1 w-full rounded border px-2 py-1.5 text-sm" /></label>
      <label className="block text-xs">Source URL<input value={asset.sourceUrl || ''} onChange={(event) => setAssets((items) => items.map((item) => item._id === asset._id ? { ...item, sourceUrl: event.target.value } : item))} className="mt-1 w-full rounded border px-2 py-1.5 text-sm" /></label>
      <label className="block text-xs">Source and license<input value={asset.licenseReference || ''} placeholder="License / usage-rights reference" onChange={(event) => setAssets((items) => items.map((item) => item._id === asset._id ? { ...item, licenseReference: event.target.value } : item))} className="mt-1 w-full rounded border px-2 py-1.5 text-sm" /></label>
      <div className="flex gap-2"><button onClick={() => save(asset)} className="flex-1 rounded bg-emerald-800 px-3 py-2 text-sm text-white">Save metadata</button><button disabled={Boolean(asset.productIds?.length)} title={asset.productIds?.length ? 'Remove from products first' : 'Delete'} onClick={() => remove(asset)} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Delete</button></div>
    </article>)}</div>}
  </div>;
}
