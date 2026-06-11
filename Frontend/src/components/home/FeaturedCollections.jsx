import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collections } from '../../assets/data';

export default function FeaturedCollections() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-warm-ivory-dark tea-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
            Curated For You
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-deep-walnut mt-3">
            Curated Collections
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {collections.map((collection, i) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Link
                to="/shop"
                className="group relative w-full aspect-[3/4] rounded-sm overflow-hidden block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient}`} />
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ backgroundImage: `url('${collection.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-walnut/80 via-deep-walnut/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-warm-ivory/70 text-sm mb-4 text-center font-[family-name:var(--font-inter)]">
                    {collection.description}
                  </p>
                  <span className="flex items-center gap-1 text-imperial-gold text-sm font-semibold uppercase tracking-wider group-hover:gap-2 transition-all font-[family-name:var(--font-inter)]">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="absolute inset-0 scale-100 group-hover:scale-110 transition-transform duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
