import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, CircleHelp, Gift, Leaf, MapPin, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryAPI, productAPI, reviewAPI, siteContentAPI } from '../../services/api';
import { IMAGE_URL } from '../../utils/image';

const unwrapList = (response, keys) => {
  const data = response?.data?.data ?? response?.data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(response?.data?.message?.[key])) return response.data.message[key];
  }
  return Array.isArray(data) ? data : [];
};

const getImage = (value) => {
  const image = Array.isArray(value) ? value[0] : value;
  const url = typeof image === 'string' ? image : image?.url || image?.secure_url || image?.src;
  if (!url) return '';
  return url.startsWith('/uploads/') ? `${IMAGE_URL}${url}` : url;
};

function SectionTitle({ eyebrow, title, description, dark = false, action }) {
  return <div className={`mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between ${dark ? 'text-white' : ''}`}>
    <div className="max-w-2xl">
      {eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[.24em] text-imperial-gold sm:text-xs">{eyebrow}</p>}
      <h2 className={`mt-2 font-[family-name:var(--font-playfair)] text-3xl font-semibold leading-tight sm:text-4xl ${dark ? 'text-white' : 'text-tea-green'}`}>{title}</h2>
      {description && <p className={`mt-2 max-w-xl text-sm leading-6 sm:text-base ${dark ? 'text-white/70' : 'text-deep-walnut/70'}`}>{description}</p>}
    </div>
    {action && <Link to={action.href || '/shop'} className={`inline-flex min-h-10 items-center gap-2 text-sm font-semibold ${dark ? 'text-imperial-gold' : 'text-tea-green'} hover:underline`}>{action.label || 'Explore'} <ArrowRight size={16} /></Link>}
  </div>;
}

function EmptyState({ icon: Icon = Leaf, children, href = '/shop', action = 'Explore the collection' }) {
  return <div className="rounded-2xl border border-dashed border-[#d8d2c3] bg-white/65 px-5 py-8 text-center sm:py-10">
    <Icon className="mx-auto h-7 w-7 text-[#a7833f]" strokeWidth={1.6} />
    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-deep-walnut/70">{children}</p>
    <Link to={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tea-green hover:underline">{action}<ArrowRight size={15} /></Link>
  </div>;
}

export function TrustBenefits({ content = {} }) {
  const [products, setProducts] = useState([]);
  useEffect(() => { let active = true; productAPI.getProducts({ limit: 12 }).then((r) => { if (active) setProducts(unwrapList(r, ['products'])); }).catch(() => {}); return () => { active = false; }; }, []);
  const hasOrigin = products.some((p) => p.origin);
  const hasBrew = products.some((p) => p.brewingGuide?.temperature || p.brewingGuide?.steepTime);
  const benefits = [
    ...(hasOrigin ? [{ icon: MapPin, title: content.originTitle || 'Origin-led teas', detail: content.originDetail || 'Explore tea by its growing region.' }] : []),
    ...(hasBrew ? [{ icon: Leaf, title: content.brewTitle || 'Brewing details', detail: content.brewDetail || 'Find preparation guidance on product pages.' }] : []),
    { icon: ShieldCheck, title: content.checkoutTitle || 'Clear checkout', detail: content.checkoutDetail || 'Review your order before confirming payment.' },
  ];
  return <section className="border-y border-[#e7e0d1] bg-[#f4f1e7] px-5 py-6 sm:px-8 sm:py-8"><div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[#d8d0be] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
    {benefits.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-center gap-4 px-2 py-4 first:pt-0 last:pb-0 sm:justify-center sm:px-5 sm:py-2 sm:first:pt-2 sm:last:pb-2"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-tea-green shadow-sm"><Icon size={20} strokeWidth={1.7} /></span><span><strong className="block font-[family-name:var(--font-playfair)] text-lg text-tea-green">{title}</strong><span className="mt-0.5 block text-xs leading-5 text-deep-walnut/65 sm:text-sm">{detail}</span></span></div>)}
  </div></section>;
}

export function ShopByCategory({ content = {} }) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; categoryAPI.getCategories().then((r) => { if (active) setItems(unwrapList(r, ['categories']).filter((x) => x.active !== false && x.isActive !== false)); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  const categories = useMemo(() => items.slice(0, Number(content.limit) || 6), [items, content.limit]);
  return <section className="bg-[#fffefa] px-5 py-12 sm:px-8 sm:py-16"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow={content.eyebrow || 'Explore the collection'} title={content.heading || 'Shop by tea type'} description={content.description || 'Find a tea style that suits the way you like to brew.'} action={{ href: '/shop', label: 'View all teas' }} />
    {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">{[0,1,2,3,4,5].map((x) => <div key={x} className="aspect-[.9/1] animate-pulse rounded-2xl bg-[#e9e6dc]" />)}</div> : error ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">Tea categories could not be loaded.</p> : categories.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">{categories.map((category) => {
      const image = getImage(category.image || category.images);
      return <Link key={category._id || category.slug || category.name} to={`/shop?category=${encodeURIComponent(category.name || category.slug || '')}`} className="group relative isolate flex aspect-[.9/1] min-h-36 items-end overflow-hidden rounded-2xl bg-[#183f31] p-4 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tea-green sm:rounded-3xl sm:p-5">
        {image && <img src={image} alt={category.imageAlt || category.name} loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
        <span className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d281e]/90 via-[#0d281e]/15 to-transparent" />
        <span className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-white sm:text-xl">{category.name}</span>
      </Link>;
    })}</div> : <EmptyState>{content.emptyText || 'Tea categories will appear here when they are available.'}</EmptyState>}
  </div></section>;
}

function ProductTile({ product }) {
  const slug = product.slug || product._id;
  const image = getImage(product.images);
  const price = Number(product.price || 0).toLocaleString('en-IN');
  const compare = Number(product.comparePrice || 0);
  const discount = compare > Number(product.price || 0) ? Math.round((compare - Number(product.price || 0)) / compare * 100) : 0;
  return <Link to={`/product/${slug}`} className="group overflow-hidden rounded-2xl border border-[#e9e4d9] bg-white shadow-[0_8px_22px_rgba(36,48,39,.06)] transition hover:-translate-y-1 hover:shadow-lg">
    <div className="relative aspect-[1.12/1] overflow-hidden bg-[#edf0e5]">{image ? <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-4xl text-tea-green/50">{product.name?.[0]}</div>}{discount > 0 && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-tea-green">Save {discount}%</span>}</div>
    <div className="p-3.5 sm:p-4"><p className="truncate text-[10px] font-semibold uppercase tracking-[.12em] text-tea-green/75">{product.origin || product.category || 'King’s Tea'}</p><h3 className="mt-1 line-clamp-2 min-h-12 font-[family-name:var(--font-playfair)] text-lg font-semibold leading-6 text-tea-green sm:text-xl">{product.name}</h3><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-deep-walnut/65 sm:text-sm">{product.shortDescription || product.description}</p><div className="mt-3 flex items-baseline gap-2"><span className="font-semibold text-tea-green">₹{price}</span>{compare > Number(product.price || 0) && <span className="text-xs text-deep-walnut/45 line-through">₹{compare.toLocaleString('en-IN')}</span>}</div></div>
  </Link>;
}

export function NewArrivals({ content = {} }) {
  const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const loadRecentProducts = async () => {
      try {
        const firstPage = await productAPI.getProducts({ page: 1, limit: 100, sort: '-createdAt' });
        const pageCount = Number(firstPage?.data?.data?.totalPages) || 1;
        const otherPages = await Promise.all(
          Array.from({ length: pageCount - 1 }, (_, index) => productAPI.getProducts({ page: index + 2, limit: 100, sort: '-createdAt' }))
        );
        const allProducts = [
          ...unwrapList(firstPage, ['products']),
          ...otherPages.flatMap((response) => unwrapList(response, ['products'])),
        ];
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - 1);
        const now = Date.now();
        const recentProducts = allProducts
          .filter((product) => {
            const addedAt = new Date(product.createdAt).getTime();
            return product.isActive !== false && Number.isFinite(addedAt) && addedAt >= cutoff.getTime() && addedAt <= now;
          })
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (active) setProducts(recentProducts);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadRecentProducts();
    return () => { active = false; };
  }, []);
  return <section className="bg-[#f7f5ee] px-5 py-12 sm:px-8 sm:py-16"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow={content.eyebrow || 'Recently added'} title={content.heading || 'Fresh to the collection'} description={content.description || 'Explore all teas added to our catalog in the last month.'} action={{ href: '/shop?sort=newest', label: 'Shop all teas' }} />
    {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{[0,1,2,3].map((x) => <div key={x} className="aspect-[.8/1] animate-pulse rounded-2xl bg-[#e9e6dc]" />)}</div> : error ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">New teas could not be loaded.</p> : products.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{products.map((product) => <ProductTile key={product._id} product={product} />)}</div> : <EmptyState>{content.emptyText || 'No teas have been added in the last month.'}</EmptyState>}
  </div></section>;
}

const moments = [
  { id: 'morning', label: 'A bold start', description: 'Fuller black teas and matcha for a more robust cup.' },
  { id: 'afternoon', label: 'Fresh & fragrant', description: 'Green and unroasted oolong teas with fresh, floral or bright notes.' },
  { id: 'gentle', label: 'A gentle pause', description: 'Delicate white teas with relatively low caffeine; they are not caffeine-free.' },
  { id: 'slow', label: 'Slow, rich sips', description: 'Pu-erh and roasted teas with earthy, woody or deeper flavors.' },
];

function getProductMoment(product) {
  const category = String(product.category || '').toLowerCase();
  const caffeine = String(product.caffeine || '').toLowerCase();
  const notes = [product.name, product.shortDescription, product.description, ...(product.tastingNotes || [])]
    .join(' ')
    .toLowerCase();

  if (category.includes('pu-erh') || /(earthy|woody|roasted|dark chocolate|deep)/.test(notes)) return 'slow';
  if (category.includes('white')) return 'gentle';
  if (category.includes('matcha') || category.includes('black') || caffeine === 'high') return 'morning';
  if (category.includes('green') || category.includes('oolong')) return 'afternoon';
  if (caffeine === 'low') return 'gentle';
  return null;
}

export function ShopByMood({ content = {} }) {
  const [products, setProducts] = useState([]);
  const [activeMoment, setActiveMoment] = useState('morning');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    productAPI.getProducts({ limit: 100, sort: '-createdAt' })
      .then((response) => {
        if (active) setProducts(unwrapList(response, ['products']).filter((product) =>
          product.isActive !== false && product.inStock !== false && !(product.stockQuantity !== undefined && product.stockQuantity <= 0)
        ));
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const groupedMoments = useMemo(() => moments.map((moment) => ({
    ...moment,
    products: products.filter((product) => getProductMoment(product) === moment.id),
  })).filter((moment) => moment.products.length > 0), [products]);
  const selectedMoment = groupedMoments.find((moment) => moment.id === activeMoment) || groupedMoments[0];

  return <section className="bg-[#fffefa] px-5 py-12 sm:px-8 sm:py-16"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow={content.eyebrow || 'Choose your moment'} title={content.heading || 'Tea for every ritual'} description={content.description || 'Find a tea to match the pace and flavor you are in the mood for.'} />
    {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">{[0,1,2,3].map((x) => <div key={x} className="h-12 animate-pulse rounded-full bg-[#e9e6dc]" />)}</div> : error ? <p role="alert" className="text-sm text-royal-terracotta">Tea selections could not be loaded.</p> : selectedMoment ? <>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Choose a tea moment">
        {groupedMoments.map((moment) => <button key={moment.id} type="button" aria-pressed={selectedMoment.id === moment.id} onClick={() => setActiveMoment(moment.id)} className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${selectedMoment.id === moment.id ? 'border-tea-green bg-tea-green text-white' : 'border-[#ded9cd] bg-white text-tea-green hover:border-tea-green'}`}>{moment.label}<span className="ml-2 text-xs opacity-75">{moment.products.length}</span></button>)}
      </div>
      <div aria-live="polite">
        <p className="mb-4 text-sm text-deep-walnut/70">{selectedMoment.description}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">{selectedMoment.products.slice(0, Number(content.limit) || 4).map((product) => <ProductTile key={product._id || product.slug} product={product} />)}</div>
      </div>
    </> : <EmptyState icon={Leaf} href="/shop" action="Browse available teas">{content.emptyText || 'There are no in-stock teas for these moments right now.'}</EmptyState>}
  </div></section>;
}

const giftStyles = [
  { id: 'all', label: 'All gift ideas', matches: () => true },
  { id: 'black', label: 'Black tea', matches: (product) => /black/i.test(product.category || '') },
  { id: 'green-matcha', label: 'Green tea & matcha', matches: (product) => /green|matcha/i.test(product.category || '') },
  { id: 'white', label: 'White tea', matches: (product) => /white/i.test(product.category || '') },
  { id: 'oolong', label: 'Oolong', matches: (product) => /oolong/i.test(product.category || '') },
  { id: 'puerh', label: 'Pu-erh', matches: (product) => /pu-erh/i.test(product.category || '') },
];

export function GiftCollections({ content = {} }) {
  const [products, setProducts] = useState([]);
  const [activeStyle, setActiveStyle] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    productAPI.getProducts({ limit: 100, sort: '-createdAt' })
      .then((response) => {
        if (!active) return;
        const all = unwrapList(response, ['products']);
        const configuredIds = Array.isArray(content.productIds) ? content.productIds.map(String) : [];
        const selected = configuredIds.length ? all.filter((product) => configuredIds.includes(String(product._id))) : all;
        setProducts(selected.filter((product) => product.isActive !== false && product.inStock !== false && !(product.stockQuantity !== undefined && product.stockQuantity <= 0)));
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [JSON.stringify(content.productIds || [])]);

  const selectedStyle = giftStyles.find((style) => style.id === activeStyle) || giftStyles[0];
  const visibleProducts = useMemo(() => products.filter(selectedStyle.matches), [products, selectedStyle]);
  const defaultDescription = 'Pick a tea style they already enjoy, or mix a few to make a personal tasting selection. Teas are sold individually.';
  const configuredDescription = String(content.description || '');
  const description = /marked for gifting|gift-ready products/i.test(configuredDescription) ? defaultDescription : configuredDescription || defaultDescription;

  return <section className="bg-[#f5f2e8] px-5 py-12 sm:px-8 sm:py-16"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow={content.eyebrow || 'Thoughtful gifting'} title={content.heading || 'Tea gifts'} description={description} />
    {loading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[0,1,2,3,4,5,6,7].map((x) => <div key={x} className="aspect-[.8/1] animate-pulse rounded-2xl bg-[#e9e6dc]" />)}</div> : error ? <p role="alert" className="text-sm text-royal-terracotta">Tea gift ideas could not be loaded.</p> : products.length ? <>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter tea gift ideas by style">
        {giftStyles.filter((style) => style.id === 'all' || products.some(style.matches)).map((style) => <button key={style.id} type="button" aria-pressed={activeStyle === style.id} onClick={() => setActiveStyle(style.id)} className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${activeStyle === style.id ? 'border-tea-green bg-tea-green text-white' : 'border-[#ded9cd] bg-white text-tea-green hover:border-tea-green'}`}>{style.label}<span className="ml-2 text-xs opacity-75">{style.id === 'all' ? products.length : products.filter(style.matches).length}</span></button>)}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{visibleProducts.map((product) => <ProductTile key={product._id || product.slug} product={product} />)}</div>
    </> : <EmptyState icon={Gift} href="/shop" action="Browse the tea collection">{content.emptyText || 'No in-stock teas are available for gift ideas right now.'}</EmptyState>}
  </div></section>;
}

export function CustomerReviews({ content = {} }) {
  const [reviews, setReviews] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; productAPI.getProducts({ limit: 6, sort: '-createdAt' }).then(async (r) => {
    const products = unwrapList(r, ['products']);
    const results = await Promise.allSettled(products.map(async (product) => {
      const response = await reviewAPI.getReviews(product._id);
      const docs = response?.data?.data?.docs || [];
      return docs.map((review) => ({ ...review, product }));
    }));
    const all = results.flatMap((result) => result.status === 'fulfilled' ? result.value : []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (active) setReviews(all.slice(0, Number(content.limit) || 3));
  }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [content.limit]);
  return <section className="bg-[#123d2e] px-5 py-12 text-white sm:px-8 sm:py-16"><div className="mx-auto max-w-7xl"><SectionTitle dark eyebrow={content.eyebrow || 'Customer reviews'} title={content.heading || 'Notes from tea drinkers'} description={content.description || 'Only approved product reviews are shown here.'} />
    {loading ? <p className="text-sm text-white/70">Loading approved reviews…</p> : error ? <p role="alert" className="text-sm text-white/80">Customer reviews could not be loaded.</p> : reviews.length ? <div className="grid gap-4 md:grid-cols-3">{reviews.map((review) => <article key={review._id} className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><div className="flex items-center gap-1 text-[#efbb58]" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: Number(review.rating) || 0 }, (_, i) => <Star key={i} size={15} fill="currentColor" />)}<span className="ml-2 text-xs text-white/80">{review.rating}/5</span></div><h3 className="mt-3 font-[family-name:var(--font-playfair)] text-lg">{review.title || review.product?.name}</h3><p className="mt-2 line-clamp-4 text-sm leading-6 text-white/75">{review.comment}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs"><span>{review.userId?.name || 'King’s Tea customer'}{review.verified && <span className="ml-2 inline-flex items-center gap-1 text-emerald-200"><CheckCircle2 size={12} />Verified purchase</span>}</span><Link to={`/product/${review.product?.slug || review.product?._id}`} className="text-[#efbb58] hover:underline">{review.product?.name}</Link></div></article>)}</div> : <EmptyState icon={Star} href="/shop" action="Explore the teas">{content.emptyText || 'Approved customer reviews will appear here when customers share them.'}</EmptyState>}
  </div></section>;
}

export function BrewingGuides({ content = {} }) {
  const [guides, setGuides] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; siteContentAPI.getContent('brewing-guides').then(({ data }) => { const raw = data?.data; const items = Array.isArray(raw) ? raw : raw?.articles || raw?.guides || []; if (active) setGuides(items.filter((item) => item.enabled !== false && item.published !== false).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)).slice(0, Number(content.limit) || 3)); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [content.limit]);
  return <section className="bg-[#fffefa] px-5 py-12 sm:px-8 sm:py-16"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow={content.eyebrow || 'Brew with confidence'} title={content.heading || 'Tea brewing guides'} description={content.description || 'Practical guidance published by King’s Tea.'} action={{ href: '/culture', label: 'Explore tea culture' }} />
    {loading ? <div className="grid gap-4 sm:grid-cols-3">{[0,1,2].map((x) => <div key={x} className="h-40 animate-pulse rounded-2xl bg-[#e9e6dc]" />)}</div> : error ? <p role="alert" className="text-sm text-royal-terracotta">Brewing guides could not be loaded.</p> : guides.length ? <div className="grid gap-4 sm:grid-cols-3">{guides.map((guide, i) => <article key={guide.slug || guide._id || i} className="rounded-2xl border border-[#e9e4d9] bg-[#f8f6ef] p-5"><BookOpen size={20} className="text-[#a7833f]" /><h3 className="mt-4 font-[family-name:var(--font-playfair)] text-xl font-semibold text-tea-green">{guide.title || guide.name}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-deep-walnut/70">{guide.excerpt || guide.description || guide.body}</p><Link to={guide.href || '/culture'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tea-green hover:underline">Read guide <ArrowRight size={15} /></Link></article>)}</div> : <EmptyState icon={BookOpen} href="/culture" action="Explore tea culture">{content.emptyText || 'Published tea preparation guides will appear here.'}</EmptyState>}
  </div></section>;
}

export function HomepageFAQ({ content = {} }) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; siteContentAPI.getContent('faq').then(({ data }) => { const list = data?.data?.items || []; if (active) setItems(list.filter((item) => item.enabled !== false).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)).slice(0, Number(content.limit) || 5)); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [content.limit]);
  return <section className="bg-[#f6f3e9] px-5 py-12 sm:px-8 sm:py-16"><div className="mx-auto max-w-4xl"><SectionTitle eyebrow={content.eyebrow || 'Customer care'} title={content.heading || 'Frequently asked questions'} description={content.description || 'Answers published by the King’s Tea team.'} action={{ href: '/faq', label: 'Visit help center' }} />
    {loading ? <p className="text-sm text-deep-walnut/60">Loading answers…</p> : error ? <p role="alert" className="text-sm text-royal-terracotta">FAQs could not be loaded.</p> : items.length ? <div className="divide-y divide-[#ded7c8] rounded-2xl border border-[#e7e0d1] bg-white px-5 sm:px-7">{items.map((item, i) => <details key={item._id || item.question || i} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-tea-green [&::-webkit-details-marker]:hidden"><span>{item.question}</span><CircleHelp size={17} className="shrink-0 text-[#a7833f] transition group-open:rotate-12" /></summary><p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-6 text-deep-walnut/70">{item.answer}</p></details>)}</div> : <EmptyState icon={CircleHelp} href="/contact" action="Contact customer care">{content.emptyText || 'There are no published questions yet. Please contact us if you need help.'}</EmptyState>}
  </div></section>;
}

export function CustomerTrust({ content = {} }) {
  const [policies, setPolicies] = useState([]);
  useEffect(() => { let active = true; siteContentAPI.getContent('policies').then(({ data }) => { const pages = data?.data?.pages || []; if (active) setPolicies(pages.filter((item) => item.enabled !== false && item.title && item.slug)); }).catch(() => {}); return () => { active = false; }; }, []);
  const links = [...policies.map((item) => ({ label: item.title, href: `/policies/${item.slug}` })), { label: content.contactLabel || 'Contact', href: '/contact' }, { label: content.faqLabel || 'FAQs', href: '/faq' }];
  return <section className="bg-[#fffefa] px-5 py-10 sm:px-8 sm:py-14"><div className="mx-auto max-w-7xl rounded-3xl bg-[#eeeadd] px-5 py-7 sm:px-8 sm:py-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="max-w-xl"><p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#a7833f]">{content.eyebrow || 'Here to help'}</p><h2 className="mt-2 font-[family-name:var(--font-playfair)] text-2xl font-semibold text-tea-green sm:text-3xl">{content.heading || 'Shop with clear information'}</h2><p className="mt-2 text-sm leading-6 text-deep-walnut/70">{content.description || 'Find customer support and published store policies before you order.'}</p></div><div className="flex flex-wrap gap-2">{links.map((item) => <Link key={item.href} to={item.href} className="rounded-full border border-[#cfc5ae] bg-white/80 px-3.5 py-2 text-xs font-medium text-tea-green transition hover:border-tea-green sm:text-sm">{item.label}</Link>)}</div></div></div></section>;
}

export function MoodCollections({ content = {} }) { return <ShopByMood content={content} />; }
export function GiftSection({ content = {} }) { return <GiftCollections content={content} />; }
