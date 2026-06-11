import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonials } from '../../assets/data';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const t = testimonials[current];

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-warm-ivory tea-pattern">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
            Testimonials
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-deep-walnut mt-3">
            What Our Patrons Say
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-white p-8 sm:p-12 rounded-sm shadow-sm border border-imperial-gold/10 text-center"
        >
          <Quote className="h-10 w-10 text-imperial-gold/20 mx-auto mb-6" />

          <motion.p
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl text-deep-walnut/80 leading-relaxed mb-8 italic"
          >
            &ldquo;{t.quote}&rdquo;
          </motion.p>

          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < t.rating ? 'text-imperial-gold fill-imperial-gold' : 'text-deep-walnut/15'
                }`}
              />
            ))}
          </div>

          <motion.div
            key={`author-${t.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full bg-tea-green flex items-center justify-center mx-auto mb-2">
              <span className="text-warm-ivory text-sm font-semibold font-[family-name:var(--font-inter)]">
                {t.avatar}
              </span>
            </div>
            <p className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut">
              {t.name}
            </p>
            <p className="text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)]">
              {t.location}
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-imperial-gold/20 flex items-center justify-center text-deep-walnut/60 hover:border-imperial-gold hover:text-imperial-gold transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-imperial-gold w-6' : 'bg-deep-walnut/20'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-imperial-gold/20 flex items-center justify-center text-deep-walnut/60 hover:border-imperial-gold hover:text-imperial-gold transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
