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

export default function HeroSection({ content = {} }) {
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
  const slides = Array.isArray(content.slides) && content.slides.length ? content.slides : heroSlides;
  const slideIndex = activeSlide % slides.length;
  const currentSlide = slides[slideIndex];
  const overlayOpacity = Number.isFinite(Number(content.overlayOpacity)) ? Math.min(0.85, Math.max(0, Number(content.overlayOpacity))) : 0.55;
  const alignment = content.textAlignment === 'left' ? 'items-start text-left' : content.textAlignment === 'right' ? 'items-end text-right' : 'items-center text-center';
  const mobileImage = content.mobileImage || currentSlide.mobileImage || currentSlide.image;

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, slides.length]);

  useEffect(() => {
    const nextImage = new window.Image();
    nextImage.src = slides[(slideIndex + 1) % slides.length].image;
  }, [slideIndex, slides]);

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
            transition={{ opacity: { duration: prefersReducedMotion ? 0 : 1.2 }, scale: { duration: 4, ease: 'linear' } }}
            className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat sm:block"
            style={{ backgroundImage: `url('${currentSlide.image}')`, backgroundPosition: 'center 56%' }}
          />
          <motion.div
            key={`mobile-${mobileImage}`}
            aria-hidden="true"
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.2 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
            style={{ backgroundImage: `url('${mobileImage}')`, backgroundPosition: content.mobileImagePosition || 'center 56%' }}
          />
        </AnimatePresence>
        <div className="absolute inset-0" style={{ backgroundColor: /^#[0-9a-f]{6}$/i.test(content.overlayColor || '') ? content.overlayColor : '#10261d', opacity: overlayOpacity * 0.45 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d1a18]/30 via-[#17281f]/20 to-[#101d16]/70" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className={`relative z-10 flex h-full flex-col justify-center px-5 pb-8 sm:px-8 ${alignment} ${content.textAlignment === 'left' ? 'sm:pl-[10vw]' : content.textAlignment === 'right' ? 'sm:pr-[10vw]' : ''}`}
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
          <Leaf className="h-4 w-4" /> {content.eyebrow || 'From gardens grown with care'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`mb-5 max-w-5xl font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.08] tracking-wide text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.3)] sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl ${content.textAlignment === 'left' ? 'sm:mr-auto' : content.textAlignment === 'right' ? 'sm:ml-auto' : ''}`}
        >
          {content.heading || 'THE ART OF ROYAL TEA'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className={`mb-7 max-w-xl font-[family-name:var(--font-cormorant)] text-xl tracking-wide text-warm-ivory/90 drop-shadow sm:mb-8 sm:text-2xl ${content.textAlignment === 'left' ? 'sm:mr-auto' : content.textAlignment === 'right' ? 'sm:ml-auto' : ''}`}
        >
          {content.description || 'Discover carefully selected teas for your everyday rituals.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className={`flex w-full max-w-[360px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4 ${content.textAlignment === 'left' ? 'sm:mr-auto' : content.textAlignment === 'right' ? 'sm:ml-auto' : ''}`}
        >
          <Link
            to={content.primaryHref || '/shop'}
            className="btn-luxury inline-block rounded-none bg-imperial-gold px-7 py-4 text-center text-sm font-semibold uppercase tracking-widest text-deep-walnut hover:bg-imperial-gold-light"
          >
            {content.primaryLabel || 'Explore Collection'}
          </Link>
          <Link
            to={content.secondaryHref || '/culture'}
            className="btn-luxury inline-block rounded-none border border-warm-ivory/65 bg-black/10 px-7 py-4 text-center text-sm font-semibold uppercase tracking-widest text-warm-ivory backdrop-blur-sm hover:bg-white/10"
          >
            {content.secondaryLabel || 'Discover Heritage'}
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
        <span className="mr-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-white/75 sm:inline">{currentSlide.location || 'King’s Tea'}</span>
        <span className="text-[10px] tabular-nums text-white/65">{String(slideIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose hero image">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${slide.location} tea garden`}
              aria-pressed={slideIndex === index}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d28b] ${slideIndex === index ? 'w-6 bg-[#f2d28b]' : 'w-2 bg-white/55 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
