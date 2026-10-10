import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Leaf } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    image: '/images/hero-slides/misty-munnar.webp',
    alt: 'Lush tea gardens across the hills of Munnar',
    location: 'Munnar, India',
  },
  {
    image: '/images/hero-slides/foggy-valparai.webp',
    alt: 'A misty morning over the Valparai tea estate',
    location: 'Valparai, India',
  },
  {
    image: '/images/hero-slides/cameron-highlands.webp',
    alt: 'Rolling green tea gardens in the Cameron Highlands',
    location: 'Cameron Highlands',
  },
];

export default function HeroSection() {
  const ref = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const currentSlide = heroSlides[activeSlide];

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  useEffect(() => {
    const nextImage = new window.Image();
    nextImage.src = heroSlides[(activeSlide + 1) % heroSlides.length].image;
  }, [activeSlide]);

  const pauseOnFocus = () => setIsPaused(true);
  const resumeAfterFocus = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
  };

  return (
    <section
      ref={ref}
      aria-label="King's Tea gardens"
      aria-roledescription="carousel"
      className="relative h-[min(78svh,700px)] min-h-[500px] overflow-hidden bg-[#10261d] sm:min-h-[560px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={pauseOnFocus}
      onBlurCapture={resumeAfterFocus}
    >
      <motion.div style={{ y }} className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide.image}
            role="img"
            aria-label={currentSlide.alt}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: prefersReducedMotion ? 0 : 1.2 }, scale: { duration: 7, ease: 'linear' } }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${currentSlide.image}')`, backgroundPosition: 'center 56%' }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#10261d]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d1a18]/45 via-[#17281f]/35 to-[#101d16]/70" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 pb-8 text-center sm:px-8"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-5 h-px bg-gradient-to-r from-transparent via-imperial-gold to-transparent sm:mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f2d28b] sm:text-xs"
        >
          <Leaf className="h-4 w-4" /> From gardens grown with care
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-5 max-w-5xl font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.08] tracking-wide text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.3)] sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
        >
          THE ART OF ROYAL TEA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-7 max-w-xl font-[family-name:var(--font-cormorant)] text-xl tracking-wide text-warm-ivory/90 drop-shadow sm:mb-8 sm:text-2xl"
        >
          Experience centuries of tea heritage in every cup.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex w-full max-w-[360px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4"
        >
          <Link
            to="/shop"
            className="btn-luxury inline-block rounded-none bg-imperial-gold px-7 py-4 text-center text-sm font-semibold uppercase tracking-widest text-deep-walnut hover:bg-imperial-gold-light"
          >
            Explore Collection
          </Link>
          <Link
            to="/culture"
            className="btn-luxury inline-block rounded-none border border-warm-ivory/65 bg-black/10 px-7 py-4 text-center text-sm font-semibold uppercase tracking-widest text-warm-ivory backdrop-blur-sm hover:bg-white/10"
          >
            Discover Heritage
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 sm:bottom-7"
      >
        <span className="font-[family-name:var(--font-inter)] text-[10px] uppercase tracking-[0.2em] text-warm-ivory/65">Scroll</span>
        <motion.div animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown className="h-5 w-5 text-imperial-gold" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-5 right-4 z-20 flex items-center gap-2.5 rounded-full border border-white/20 bg-black/25 px-3 py-2 backdrop-blur-md sm:bottom-7 sm:right-8 sm:gap-3 sm:px-4">
        <span className="mr-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-white/75 sm:inline">{currentSlide.location}</span>
        <span className="text-[10px] tabular-nums text-white/65">{String(activeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span>
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose hero image">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${slide.location} tea garden`}
              aria-pressed={activeSlide === index}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d28b] ${activeSlide === index ? 'w-6 bg-[#f2d28b]' : 'w-2 bg-white/55 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
