import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { siteContentAPI } from '../services/api';

export function FAQPage() {
  const [content, setContent] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => { siteContentAPI.getContent('faq').then(({ data }) => setContent(data?.data)).catch(() => setError(true)).finally(() => setLoading(false)); }, []);
  const faqs = (content?.items || []).filter((item) => item.enabled !== false && `${item.question || ''} ${item.answer || ''}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  return <main className="mx-auto min-h-[60vh] max-w-4xl px-5 py-12 sm:py-16"><p className="text-xs font-semibold uppercase tracking-[.2em] text-imperial-gold">Customer care</p><h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl text-tea-green">Frequently asked questions</h1><label className="mt-6 block"><span className="sr-only">Search questions</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions" className="w-full rounded-lg border bg-white px-4 py-3" /></label>{loading ? <p className="mt-8">Loading FAQs…</p> : error ? <p role="alert" className="mt-8">FAQs could not be loaded. Please try again later.</p> : faqs.length ? <div className="mt-8 divide-y">{faqs.map((item, i) => <details key={`${item.question}-${i}`} className="py-5"><summary className="cursor-pointer font-semibold text-tea-green">{item.question}</summary><p className="mt-3 whitespace-pre-line text-deep-walnut/80">{item.answer}</p></details>)}</div> : <p className="mt-8 text-deep-walnut/70">{content ? 'No matching questions found.' : 'No FAQs have been published yet.'}</p>}</main>;
}

export function PolicyPage() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { siteContentAPI.getContent('policies').then(({ data }) => setContent(data?.data)).catch(() => setContent(null)).finally(() => setLoading(false)); }, []);
  const page = (content?.pages || []).find((item) => item.slug === slug && item.enabled !== false);
  return <main className="mx-auto min-h-[60vh] max-w-4xl px-5 py-12 sm:py-16">{loading ? <p>Loading policy…</p> : page ? <><p className="text-xs font-semibold uppercase tracking-[.2em] text-imperial-gold">King&apos;s Tea policies</p><h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl text-tea-green">{page.title}</h1><article className="prose mt-8 max-w-none whitespace-pre-line leading-7 text-deep-walnut/80">{page.body}</article></> : <section><h1 className="font-[family-name:var(--font-playfair)] text-3xl text-tea-green">Policy not available</h1><p className="mt-3 text-deep-walnut/75">This policy has not been published.</p><Link to="/contact" className="mt-5 inline-block underline">Contact us</Link></section>}</main>;
}
