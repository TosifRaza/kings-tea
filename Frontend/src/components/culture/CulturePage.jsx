import { motion } from 'framer-motion';
import { Globe, Leaf, Award, Music2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../assets/data';

const brewingMethods = [
  { icon: Globe, title: 'Gongfu Cha', origin: 'Chinese', description: "Multiple short infusions with a high leaf-to-water ratio, revealing the tea's evolving character across each steep.", details: '5g leaf • 150ml • 30s steeps' },
  { icon: Leaf, title: 'Senchadō', origin: 'Japanese', description: 'The refined art of steeping sencha, emphasizing precise temperature control and the beauty of simplicity.', details: '3g leaf • 200ml • 90s steep' },
  { icon: Award, title: 'Afternoon Tea', origin: 'British', description: 'The elegant tradition of brewing robust black teas served with milk, accompanied by scones and sandwiches.', details: '3g leaf • 250ml • 4min steep' },
  { icon: Music2, title: 'Grandpa Style', origin: 'Universal', description: 'The simplest and most meditative method — leaves steep freely in a glass, refilled as you drink.', details: '3g leaf • 300ml • Ongoing' },
];

const timeline = [
  { year: '2737 BC', event: 'Legend says Emperor Shen Nung discovers tea when leaves fall into his boiling water.' },
  { year: '618 AD', event: "Tang Dynasty establishes tea as China's national drink and begins formal tea culture." },
  { year: '1191', event: 'Eisai brings tea seeds and Zen tea practices from China to Japan.' },
  { year: '1610', event: 'Dutch East India Company imports the first commercial tea shipment to Europe.' },
  { year: '1840', event: 'Anna, Duchess of Bedford, popularizes afternoon tea in England.' },
  { year: '1904', event: 'Ice tea is invented at the St. Louis World\'s Fair.' },
  { year: '2024', event: "KING'S TEA continues the tradition, sourcing the world's finest teas for modern connoisseurs." },
];

const teaPairings = [
  { tea: 'Imperial Dragon Well', pairs: 'Steamed fish, light salads, jasmine rice', type: 'Green Tea' },
  { tea: 'Royal Darjeeling', pairs: 'Scones, light cakes, cucumber sandwiches', type: 'Black Tea' },
  { tea: 'Silver Needle Reserve', pairs: 'Fresh fruit, mild cheeses, white chocolate', type: 'White Tea' },
  { tea: 'Jade Oolong Supreme', pairs: 'Roasted duck, mushroom dishes, smoked salmon', type: 'Oolong Tea' },
  { tea: 'Aged Pu-erh 2005', pairs: 'Dark chocolate, aged cheeses, red meat', type: 'Pu-erh Tea' },
  { tea: 'Kyoto Matcha', pairs: 'Mochi, wagashi, dark chocolate truffles', type: 'Matcha' },
];

export default function CulturePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen">
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/tea-ceremony.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-walnut/70 via-deep-walnut/50 to-deep-walnut/80" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Discover</span>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">The Way of Tea</h1>
          <p className="text-warm-ivory/70 font-[family-name:var(--font-cormorant)] text-lg max-w-xl">Immerse yourself in the ancient traditions, ceremonies, and cultural practices that have elevated tea from a simple beverage to an art form.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Techniques</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">Brewing Methods</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {brewingMethods.map((method, i) => (
              <motion.div key={method.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-sm border border-imperial-gold/10 luxury-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-tea-green/10 flex items-center justify-center flex-shrink-0">
                    <method.icon className="h-6 w-6 text-tea-green" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut">{method.title}</h3>
                      <span className="bg-imperial-gold/10 text-imperial-gold-dark text-[10px] border-0 rounded-sm px-1.5 py-0.5">{method.origin}</span>
                    </div>
                    <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] leading-relaxed mb-2">{method.description}</p>
                    <p className="text-tea-green text-xs font-[family-name:var(--font-inter)] font-medium">{method.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Through the Ages</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">A History of Tea</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-imperial-gold/20 -translate-x-1/2" />
            {timeline.map((item, i) => (
              <motion.div key={item.year} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                  <div className="bg-white p-4 rounded-sm border border-imperial-gold/10 inline-block">
                    <span className="font-[family-name:var(--font-playfair)] font-bold text-tea-green text-lg">{item.year}</span>
                    <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] mt-1 max-w-xs">{item.event}</p>
                  </div>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-imperial-gold border-2 border-warm-ivory z-10 mt-2" />
                <div className="flex-1 md:hidden pl-10">
                  <span className="font-[family-name:var(--font-playfair)] font-bold text-tea-green">{item.year}</span>
                  <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] mt-1">{item.event}</p>
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Harmonize</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">Tea Pairings</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teaPairings.map((pairing, i) => (
              <motion.div key={pairing.tea} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white p-5 rounded-sm border border-imperial-gold/10 hover:border-imperial-gold/30 transition-colors">
                <span className="bg-tea-green/10 text-tea-green text-[10px] border-0 rounded-sm px-1.5 py-0.5 mb-2 inline-block">{pairing.type}</span>
                <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-2">{pairing.tea}</h3>
                <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)]">Pairs with: {pairing.pairs}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">From the Journal</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">Featured Articles</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogPosts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group bg-white rounded-sm overflow-hidden border border-imperial-gold/10 luxury-card cursor-pointer">
                <div className={`aspect-video bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-deep-walnut/30 group-hover:bg-deep-walnut/20 transition-colors" />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/90 text-deep-walnut text-[10px] border-0 rounded-sm px-1.5 py-0.5">{post.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut mb-2 group-hover:text-tea-green transition-colors">{post.title}</h3>
                  <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] leading-relaxed mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-deep-walnut/40 text-[10px] font-[family-name:var(--font-inter)]">{post.date}</span>
                    <span className="text-deep-walnut/40 text-[10px] font-[family-name:var(--font-inter)]">{post.readTime}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="btn-luxury border border-tea-green text-tea-green hover:bg-tea-green hover:text-warm-ivory px-8 py-5 text-xs font-semibold uppercase tracking-widest rounded-none inline-flex items-center gap-2">
              Explore Our Teas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
