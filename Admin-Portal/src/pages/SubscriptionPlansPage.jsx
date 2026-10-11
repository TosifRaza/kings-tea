import { useEffect, useState } from 'react';
import api from '../services/api';

const empty = { name: '', slug: '', description: '', price: '', currency: 'INR', interval: 'month', benefitsText: '', active: false, sortOrder: 0 };
export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const load = async () => { try { const { data } = await api.get('/subscriptions/admin/plans'); setPlans(data?.data || []); } catch (e) { setError(e.response?.data?.message || 'Unable to load plans.'); } };
  useEffect(() => { load(); }, []);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage('');
    const data = { ...form, price: Number(form.price), sortOrder: Number(form.sortOrder), benefits: form.benefitsText.split('\n').map((item) => item.trim()).filter(Boolean) };
    delete data.benefitsText;
    try { if (editingId) await api.put(`/subscriptions/admin/plans/${editingId}`, data); else await api.post('/subscriptions/admin/plans', data); setForm(empty); setEditingId(''); setMessage('Plan saved. Customer enrollment remains disabled until recurring payment processing is integrated.'); await load(); }
    catch (e) { setError(e.response?.data?.message || 'Unable to save plan.'); }
  };
  const edit = (plan) => { setEditingId(plan._id); setForm({ ...plan, price: String(plan.price), benefitsText: (plan.benefits || []).join('\n') }); };
  const remove = async (id) => { try { await api.delete(`/subscriptions/admin/plans/${id}`); setPlans((items) => items.filter((item) => item._id !== id)); } catch (e) { setError(e.response?.data?.message || 'Unable to delete plan.'); } };
  return <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
    <header><h1 className="text-2xl font-semibold">Subscription plans</h1><p className="text-sm text-gray-600">Manage published plan information. Enrollment is intentionally unavailable until a real recurring billing provider and webhook flow are in place.</p></header>
    {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
    <form onSubmit={submit} className="grid gap-3 rounded-xl bg-white p-4 shadow sm:grid-cols-2 lg:grid-cols-3">
      <input required placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded border p-2" />
      <input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded border p-2" />
      <input required min="0" step="0.01" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded border p-2" />
      <select value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} className="rounded border p-2"><option value="month">Monthly</option><option value="quarter">Quarterly</option><option value="year">Yearly</option></select>
      <input placeholder="Currency (INR)" maxLength={3} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} className="rounded border p-2" />
      <input type="number" placeholder="Display order" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="rounded border p-2" />
      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded border p-2 sm:col-span-2 lg:col-span-3" />
      <textarea placeholder="Benefits (one per line)" value={form.benefitsText} onChange={(e) => setForm({ ...form, benefitsText: e.target.value })} className="rounded border p-2 sm:col-span-2 lg:col-span-3" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Publish this plan for display</label>
      <div className="flex gap-2"><button className="rounded bg-emerald-900 px-4 py-2 text-white">{editingId ? 'Update plan' : 'Create plan'}</button>{editingId && <button type="button" onClick={() => { setEditingId(''); setForm(empty); }} className="rounded border px-4 py-2">Cancel</button>}</div>
    </form>
    <div className="grid gap-3 sm:grid-cols-2">{plans.map((plan) => <article key={plan._id} className="rounded-xl border bg-white p-4"><div className="flex justify-between gap-3"><div><h2 className="font-semibold">{plan.name}</h2><p className="text-sm text-gray-600">{plan.currency} {plan.price} / {plan.interval} · {plan.active ? 'Published' : 'Draft'}</p><p className="mt-2 text-sm">{plan.description}</p></div><div className="flex gap-2"><button onClick={() => edit(plan)} className="text-sm text-emerald-800">Edit</button><button onClick={() => remove(plan._id)} className="text-sm text-red-700">Delete</button></div></div></article>)}</div>
  </div>;
}
