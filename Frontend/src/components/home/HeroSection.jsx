import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-tea-plantation.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-walnut/60 via-deep-walnut/40 to-deep-walnut/70" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        {/* Gold decorative line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-imperial-gold to-transparent mb-8"
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide mb-6"
        >
          THE ART OF ROYAL TEA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl text-warm-ivory/80 max-w-xl mb-10 tracking-wide"
        >
          Experience centuries of tea heritage in every cup.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/shop"
            className="btn-luxury bg-imperial-gold hover:bg-imperial-gold-light text-deep-walnut font-semibold px-8 py-6 text-sm uppercase tracking-widest rounded-none inline-block text-center"
          >
            Explore Collection
          </Link>
          <Link
            to="/culture"
            className="btn-luxury border border-imperial-gold/60 text-imperial-gold hover:bg-imperial-gold/10 font-semibold px-8 py-6 text-sm uppercase tracking-widest rounded-none bg-transparent inline-block text-center"
          >
            Discover Heritage
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-warm-ivory/50 text-xs uppercase tracking-widest font-[family-name:var(--font-inter)]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5 text-imperial-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
