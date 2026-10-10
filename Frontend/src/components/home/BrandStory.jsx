import { motion, useInView } from 'framer-motion';
import { ArrowRight, CupSoda, Leaf, Mountain, Sprout } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const heritagePoints = [
  { icon: Leaf, title: '150+ YEARS', detail: 'Of Heritage' },
  { icon: Mountain, title: 'PREMIUM TEA GARDENS', detail: 'From the Finest Regions' },
  { icon: Sprout, title: 'TRUSTED BY GENERATIONS', detail: 'A Family Tradition' },
  { icon: CupSoda, title: 'PURE & NATURAL', detail: 'No Artificial Flavors' },
];

export default function BrandStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden bg-warm-ivory text-tea-green">
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-7 px-5 pb-12 pt-10 sm:px-8 lg:min-h-[600px] lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:px-12 lg:pb-14 lg:pt-12">
        <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 font-[family-name:var(--font-playfair)] text-[11px] uppercase tracking-[0.18em] text-tea-green/75 lg:flex">
          <span>Tradition</span><i className="h-5 w-px bg-imperial-gold/70" /><span>Quality</span><i className="h-5 w-px bg-imperial-gold/70" /><span>Heritage</span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -36 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75 }}
          className="relative mx-auto w-full max-w-[680px] lg:ml-6"
        >
          <div
            className="aspect-[1.02/1] overflow-hidden drop-shadow-[0_18px_24px_rgba(32,48,31,0.12)] sm:aspect-[1.12/1] lg:aspect-[0.98/1]"
            style={{ clipPath: 'polygon(9% 3%, 22% 1%, 35% 3%, 47% 0%, 58% 2%, 69% 0%, 82% 3%, 96% 1%, 94% 10%, 99% 18%, 96% 28%, 100% 39%, 96% 49%, 99% 59%, 95% 70%, 98% 80%, 92% 89%, 94% 97%, 82% 95%, 70% 100%, 59% 96%, 47% 100%, 36% 96%, 23% 99%, 12% 95%, 5% 98%, 7% 88%, 1% 80%, 5% 70%, 0% 59%, 4% 48%, 1% 38%, 5% 27%, 2% 17%, 8% 10%)' }}
          >
            <img
              src="/images/tea-craftsmanship.png"
              alt="Experienced tea maker carefully hand-picking fresh tea leaves"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
          <Leaf aria-hidden="true" className="absolute -bottom-1 right-[2%] h-14 w-14 rotate-[35deg] text-tea-green/70 drop-shadow-sm sm:h-20 sm:w-20" strokeWidth={1.1} />
          <Sprout aria-hidden="true" className="absolute bottom-[10%] left-[2%] h-10 w-10 -rotate-12 text-tea-green/60 sm:h-14 sm:w-14" strokeWidth={1.1} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.12 }}
          className="mx-auto w-full max-w-[640px] py-2 lg:ml-0 lg:py-8"
        >
          <div className="mb-3 flex items-center justify-center gap-4 sm:justify-start">
            <span className="h-px w-12 bg-imperial-gold sm:w-16" />
            <Leaf aria-hidden="true" className="h-7 w-7 -rotate-45 text-imperial-gold" strokeWidth={1.5} />
            <span className="h-px w-12 bg-imperial-gold sm:w-16" />
          </div>
          <p className="mb-2 text-center font-[family-name:var(--font-playfair)] text-[11px] font-semibold uppercase tracking-[0.24em] text-tea-green/75 sm:text-left">
            Our Heritage
          </p>
          <h2 className="mb-5 text-center font-[family-name:var(--font-playfair)] text-[2.25rem] font-bold leading-[1.08] tracking-tight text-tea-green sm:text-left sm:text-5xl lg:text-[3.5rem]">
            A Legacy Brewed
            <br className="hidden sm:block" />
            <span className="text-imperial-gold sm:italic">Through Generations</span>
          </h2>
          <div className="space-y-3 font-[family-name:var(--font-playfair)] text-[15px] leading-[1.7] text-deep-walnut/80 sm:text-[17px]">
            <p>
              For over 150 years, KING&apos;S TEA has journeyed to the world&apos;s most revered tea gardens, forging relationships with master growers who share our unwavering commitment to excellence.
            </p>
            <p>
              Every leaf in our collection tells a story of terroir, tradition, and timeless craftsmanship.
            </p>
          </div>
          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:gap-4 lg:mt-8">
            <p className="rotate-[-4deg] text-center font-[family-name:var(--font-playfair)] text-xl italic leading-tight text-tea-green/85 sm:text-left sm:text-2xl">
              More Than Tea
              <span className="block text-base">— It&apos;s Our Legacy —</span>
            </p>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-imperial-gold bg-tea-green px-7 py-3 font-[family-name:var(--font-playfair)] text-xs font-semibold uppercase tracking-[0.12em] text-warm-ivory shadow-sm transition hover:bg-tea-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tea-green"
            >
              Explore Our Story <ArrowRight size={18} className="text-imperial-gold" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="relative border-y border-imperial-gold/25 bg-[#f8f3e8] px-5 py-6 sm:px-8 lg:px-12 lg:py-8">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-0">
          {heritagePoints.map(({ icon: Icon, title, detail }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.25 + index * 0.1 }}
              className={`flex items-center justify-center gap-3 px-2 sm:justify-start sm:px-5 lg:gap-4 ${index % 2 === 0 ? 'border-r border-imperial-gold/20 sm:border-r' : 'sm:border-r'} ${index === 3 ? 'sm:border-r-0' : ''}`}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-imperial-gold/35 bg-warm-ivory text-tea-green sm:h-14 sm:w-14">
                <Icon size={24} strokeWidth={1.6} />
              </span>
              <span className="min-w-0">
                <span className="block font-[family-name:var(--font-playfair)] text-[9px] font-bold uppercase tracking-[0.1em] text-deep-walnut sm:text-[10px] lg:text-[11px] lg:tracking-[0.12em]">{title}</span>
                <span className="mt-1 block font-[family-name:var(--font-playfair)] text-[11px] text-deep-walnut/70 sm:text-xs">{detail}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
