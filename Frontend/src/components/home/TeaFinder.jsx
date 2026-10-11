import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../services/api';

const questions = [
  { key: 'type', title: 'What kind of tea do you enjoy?', options: ['Any', 'Black Tea', 'Green Tea', 'Oolong Tea', 'White Tea', 'Matcha', 'Pu-erh Tea'] },
  { key: 'caffeine', title: 'How much caffeine would you prefer?', options: ['Any', 'Low', 'Medium', 'High'] },
  { key: 'flavor', title: 'Which flavor sounds best?', options: ['Any', 'Floral', 'Sweet', 'Earthy', 'Vegetal', 'Malty'] },
];

export default function TeaFinder() {
  const [products, setProducts] = useState([]);
  const [answers, setAnswers] = useState({ type: 'Any', caffeine: 'Any', flavor: 'Any' });
  const [step, setStep] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true; setLoading(true);
    productAPI.getProducts({ limit: 100 }).then(({ data }) => { if (active) setProducts(data?.data?.products || []); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const recommendations = useMemo(() => products.filter((product) => {
    const available = product.isActive !== false && (product.stockQuantity === undefined || product.stockQuantity > 0);
    const typeMatches = answers.type === 'Any' || String(product.category || '').toLowerCase().includes(answers.type.toLowerCase().replace(' tea', ''));
    const caffeineMatches = answers.caffeine === 'Any' || String(product.caffeine || '').toLowerCase() === answers.caffeine.toLowerCase();
    const flavorMatches = answers.flavor === 'Any' || (product.tastingNotes || []).some((note) => String(note).toLowerCase().includes(answers.flavor.toLowerCase()));
    return available && typeMatches && caffeineMatches && flavorMatches;
  }).slice(0, 3), [products, answers]);
  return <section className="bg-[#f5f2e8] px-5 py-12 sm:py-16"><div className="mx-auto max-w-5xl rounded-2xl bg-white p-5 shadow-sm sm:p-9"><p className="text-xs font-semibold uppercase tracking-[.22em] text-imperial-gold">Find your perfect cup</p><h2 className="mt-2 font-[family-name:var(--font-playfair)] text-3xl text-tea-green sm:text-4xl">Tea Finder</h2>{step < 0 ? <><p className="mt-3 text-deep-walnut/70">Answer a few quick questions for suggestions based on our current catalog.</p><button onClick={() => setStep(0)} className="mt-5 rounded-full bg-tea-green px-6 py-3 text-sm font-semibold text-white">Start quiz</button></> : <><div className="mt-4 h-1.5 rounded-full bg-gray-100"><div className="h-full rounded-full bg-imperial-gold transition-all" style={{ width: `${step === questions.length ? 100 : ((step + 1) / questions.length) * 100}%` }} /></div>{step < questions.length ? <div className="mt-6"><p className="font-medium text-deep-walnut">{questions[step].title}</p><div className="mt-4 flex flex-wrap gap-2">{questions[step].options.map((option) => <button key={option} onClick={() => { setAnswers((current) => ({ ...current, [questions[step].key]: option })); setStep((current) => current + 1); }} className="rounded-full border px-4 py-2 text-sm hover:border-tea-green hover:bg-tea-green/5">{option}</button>)}</div><button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="mt-4 text-sm underline disabled:opacity-40">Back</button></div> : <div className="mt-6"><h3 className="font-semibold">Your tea suggestions</h3>{loading ? <p className="mt-3 text-sm">Loading catalog…</p> : error ? <p role="alert" className="mt-3 text-sm">We could not load products. Please try again.</p> : recommendations.length ? <div className="mt-3 grid gap-3 sm:grid-cols-3">{recommendations.map((product) => <Link key={product._id} to={`/product/${product.slug}`} className="rounded-lg border p-3 hover:shadow"><img src={product.images?.[0]} alt={product.name} className="h-32 w-full rounded object-cover" loading="lazy" /><h4 className="mt-2 font-semibold text-tea-green">{product.name}</h4><p className="mt-1 text-xs text-deep-walnut/65">Matches your preferences: {answers.type !== 'Any' ? answers.type : ''}{answers.caffeine !== 'Any' ? ` · ${answers.caffeine} caffeine` : ''}{answers.flavor !== 'Any' ? ` · ${answers.flavor} notes` : ''}</p></Link>)}</div> : <p className="mt-3 text-sm text-deep-walnut/70">No available tea matches every answer. Try changing a preference.</p>}<button onClick={() => { setAnswers({ type: 'Any', caffeine: 'Any', flavor: 'Any' }); setStep(-1); }} className="mt-5 text-sm underline">Start again</button></div>}</>}</div></section>;
}
