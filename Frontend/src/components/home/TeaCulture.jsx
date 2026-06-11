import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Music, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: BookOpen,
    title: 'Brewing Guides',
    description: 'Master the art of brewing with our step-by-step guides for every tea variety.',
  },
  {
    icon: Music,
    title: 'Tasting Notes',
    description: 'Develop your palate with our detailed tasting profiles and flavor wheel.',
  },
  {
    icon: FileText,
    title: 'Tea Stories',
    description: 'Discover the rich history and cultural significance behind every cup.',
  },
];

export default function TeaCulture() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-warm-ivory-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="w-12 h-px bg-imperial-gold mb-4" />
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
              Tea Culture
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-deep-walnut mt-3 mb-6">
              The Way of Tea
            </h2>
            <p className="text-deep-walnut/70 font-[family-name:var(--font-inter)] text-sm leading-relaxed mb-8">
              Tea is more than a beverage — it is a ritual, a meditation, and a
              bridge between cultures. From the precise choreography of the
              Japanese tea ceremony to the convivial British afternoon tea, every
              tradition offers a unique window into the soul of a civilization. At
              KING&apos;S TEA, we honor these traditions while making them
              accessible to the modern connoisseur.
            </p>

            <div className="space-y-5 mb-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-tea-green/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-tea-green" />
                  </div>
                  <div>
                    <h4 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/culture"
              className="btn-luxury bg-tea-green hover:bg-tea-green-light text-warm-ivory px-6 py-5 text-xs font-semibold uppercase tracking-widest rounded-none inline-flex items-center gap-2"
            >
              Explore Tea Culture <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-sm overflow-hidden img-zoom">
              <img
                src="/images/tea-ceremony.png"
                alt="Tea ceremony"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-imperial-gold/40" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-imperial-gold/40" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
