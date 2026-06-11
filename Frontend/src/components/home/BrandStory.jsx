import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '150+', label: 'Years Heritage' },
  { value: '12', label: 'Tea Gardens' },
  { value: '50+', label: 'Varieties' },
  { value: '100%', label: 'Organic' },
];

export default function BrandStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-warm-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-sm overflow-hidden img-zoom">
              <img
                src="/images/tea-craftsmanship.png"
                alt="Tea craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-imperial-gold/30 rounded-sm -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-12 h-px bg-imperial-gold mb-4" />
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
              Our Heritage
            </span>

            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-deep-walnut mt-3 mb-6">
              A Legacy Brewed
              <br />
              Through Generations
            </h2>

            <div className="space-y-4 text-deep-walnut/70 font-[family-name:var(--font-inter)] text-sm leading-relaxed">
              <p>
                For over 150 years, KING&apos;S TEA has journeyed to the
                world&apos;s most revered tea gardens, forging relationships
                with master growers who share our unwavering commitment to
                excellence. Every leaf in our collection tells a story of
                terroir, tradition, and timeless craftsmanship.
              </p>
              <p>
                From the misty peaks of Darjeeling to the ancient forests of
                Yunnan, we source only the finest orthodox teas — hand-picked,
                carefully processed, and curated with the discerning palate of a
                true connoisseur. Our sustainability promise ensures that every
                cup supports the communities and ecosystems that make these
                extraordinary teas possible.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-10 border-t border-imperial-gold/20">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-tea-green">
                    {stat.value}
                  </div>
                  <div className="text-deep-walnut/50 text-xs uppercase tracking-wider mt-1 font-[family-name:var(--font-inter)]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
