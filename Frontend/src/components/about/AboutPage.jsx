import { motion } from 'framer-motion';
// import { Heart, Leaf, Award, Globe } from 'lucide-react';
import {
  Heart,
  Leaf,
  Award,
  Globe,
  Shield,
  Sparkles
} from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: 'Premium Tea Selection',
    description: 'Every tea is carefully selected from renowned tea gardens to ensure exceptional flavor, aroma, and freshness in every cup.'
  },
  {
    icon: Globe,
    title: 'Direct Garden Partnerships',
    description: 'We work closely with trusted tea estates and growers, ensuring authenticity, transparency, and fair value throughout the sourcing process.'
  },
  {
    icon: Award,
    title: 'Exceptional Quality Standards',
    description: 'Only the finest teas that meet our rigorous quality standards become part of the KING\'S TEA collection.'
  },
  {
    icon: Heart,
    title: 'Customer Experience',
    description: 'From sourcing to delivery, we are committed to providing an outstanding tea experience and building lasting relationships with tea lovers.'
  },
  {
    icon: Shield,
    title: 'Purity & Trust',
    description: 'Our teas are sourced and processed with care, ensuring natural ingredients, freshness, and complete customer confidence.'
  },
  {
    icon: Sparkles,
    title: 'Tea Culture & Education',
    description: 'We strive to share the rich heritage, traditions, and knowledge of fine teas with tea enthusiasts around the world.'
  }
];

const team = [
  { name: 'Tosif Raza', role: 'Founder & Master Tea Buyer', initials: 'TR' },
  { name: 'Tosif Raza', role: 'Director of Tea Education', initials: 'TR' },
  { name: 'Tosif Raza', role: 'Head of Sourcing, Asia', initials: 'TR' },
  { name: 'Tosif Raza', role: 'Chief Experience Officer', initials: 'TR' },
];

const milestones = [
  {
    year: '2026',
    event: "KING'S TEA brand concept was created."
  },
  {
    year: '2026',
    event: 'Website and online store launched.'
  },
  {
    year: '2026',
    event: 'Partnerships established with premium tea suppliers.'
  },
  {
    year: '2027',
    event: 'First 1,000 customers served.'
  }
];

export default function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen">
      <div className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/tea-craftsmanship.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-walnut/70 to-deep-walnut/80" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Our Story</span>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">About KING&apos;S TEA</h1>
          <p className="text-warm-ivory/70 font-[family-name:var(--font-cormorant)] text-lg max-w-xl">Dedicated to sourcing and delivering premium teas with exceptional quality, authenticity, and craftsmanship.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-px bg-imperial-gold mb-4" />
              <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Our Heritage</span>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3 mb-6">A Legacy of Excellence</h2>
              <div className="space-y-4 text-deep-walnut/70 font-[family-name:var(--font-inter)] text-sm leading-relaxed">
                <p>
    At KING&apos;S TEA, excellence is more than a standard—it is the foundation of everything we do. Our journey began with a passion for discovering exceptional teas and sharing their unique stories with tea lovers around the world.
  </p>

  <p>
    Inspired by the rich heritage of tea cultivation and craftsmanship, we carefully source premium teas from renowned tea-growing regions. Every tea in our collection is selected for its quality, character, and authentic flavor, ensuring a remarkable experience in every cup.
  </p>

  <p>
    We believe that great tea is created through dedication, expertise, and respect for tradition. From the gardens where the leaves are grown to the moment they reach your table, we are committed to maintaining the highest standards of freshness, purity, and excellence.
  </p>

  <p>
    Today, KING&apos;S TEA continues to serve a growing community of tea enthusiasts who value quality, authenticity, and the timeless pleasure of fine tea. Our mission is simple: to bring the world&apos;s finest teas closer to those who appreciate the art of tea.
  </p>
  </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden">
                <img src="/images/hero-tea-plantation.png" alt="Tea plantation" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-imperial-gold/40" />
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">What We Stand For</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">Our Values</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center bg-white p-6 rounded-sm border border-imperial-gold/10 luxury-card">
                <div className="w-12 h-12 rounded-full bg-tea-green/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-tea-green" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut mb-2">{value.title}</h3>
                <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Through the Years</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">Our Journey</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="max-w-2xl mx-auto space-y-0">
            {milestones.map((milestone, i) => (
              <motion.div key={milestone.year} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-6 pb-8 relative">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-imperial-gold border-2 border-warm-ivory z-10" />
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-imperial-gold/20 mt-1" />}
                </div>
                <div className="pb-2">
                  <span className="font-[family-name:var(--font-playfair)] font-bold text-tea-green">{milestone.year}</span>
                  <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] mt-1">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">The People</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">Our Team</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-tea-green to-tea-green-light flex items-center justify-center mx-auto mb-3">
                  <span className="text-warm-ivory font-[family-name:var(--font-playfair)] font-bold text-xl">{member.initials}</span>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm">{member.name}</h3>
                <p className="text-deep-walnut/50 text-[11px] font-[family-name:var(--font-inter)] mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-tea-green rounded-sm p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201,168,106,0.3) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
            </div>
            <div className="relative z-10">
              <Leaf className="h-8 w-8 text-imperial-gold mx-auto mb-4" />
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-warm-ivory mb-4">Our Commitment to Sustainability</h2>
              <p className="text-warm-ivory/70 font-[family-name:var(--font-inter)] text-sm max-w-2xl mx-auto leading-relaxed mb-8">From biodynamic farming practices to carbon-neutral shipping, every aspect of our business is designed to protect the environment and support the communities that make our teas possible.</p>
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                <div><div className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-imperial-gold">100%</div><div className="text-warm-ivory/50 text-[10px] uppercase tracking-wider font-[family-name:var(--font-inter)]">Organic</div></div>
                <div><div className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-imperial-gold">0</div><div className="text-warm-ivory/50 text-[10px] uppercase tracking-wider font-[family-name:var(--font-inter)]">Carbon</div></div>
                <div><div className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-imperial-gold">12</div><div className="text-warm-ivory/50 text-[10px] uppercase tracking-wider font-[family-name:var(--font-inter)]">Gardens</div></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}


