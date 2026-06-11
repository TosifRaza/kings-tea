import { motion } from 'framer-motion';
import { Heart, Leaf, Award, Globe } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Heritage & Tradition', description: 'We honor centuries of tea tradition while making it accessible for the modern connoisseur. Every selection respects the craft.' },
  { icon: Leaf, title: 'Sustainability', description: "From biodynamic farming to carbon-neutral shipping, we're committed to protecting the planet that gives us these extraordinary teas." },
  { icon: Award, title: 'Uncompromising Quality', description: "We taste hundreds of teas each season and select only the top 2%. If it doesn't meet our standard, it doesn't bear our name." },
  { icon: Globe, title: 'Direct Sourcing', description: 'We work directly with tea gardens, ensuring fair prices for growers and authentic provenance for our customers.' },
];

const team = [
  { name: 'William Ashford', role: 'Founder & Master Tea Buyer', initials: 'WA' },
  { name: 'Dr. Mei Lin Chen', role: 'Director of Tea Education', initials: 'MC' },
  { name: 'Raj Patel', role: 'Head of Sourcing, Asia', initials: 'RP' },
  { name: 'Sophia Blackwell', role: 'Chief Experience Officer', initials: 'SB' },
];

const milestones = [
  { year: '1872', event: "Ashford family begins trading fine teas from London's East End." },
  { year: '1920', event: 'First direct sourcing expedition to Darjeeling tea gardens.' },
  { year: '1965', event: "Introduction of the KING'S TEA brand and first luxury collection." },
  { year: '1998', event: "Launch of the KING'S TEA Society subscription program." },
  { year: '2015', event: 'Certification as a fully organic and carbon-neutral tea company.' },
  { year: '2024', event: "Celebrating over 150 years of tea excellence with 12 garden partnerships." },
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
          <p className="text-warm-ivory/70 font-[family-name:var(--font-cormorant)] text-lg max-w-xl">Over 150 years of passion, heritage, and uncompromising dedication to the world&apos;s finest teas.</p>
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
                <p>KING&apos;S TEA was born from a simple belief: that the world&apos;s finest teas deserve a brand that honors their origin, craftsmanship, and cultural significance. Founded in 1872, our family has spent over 150 years cultivating relationships with the most esteemed tea gardens across Asia and beyond.</p>
                <p>Today, we continue that tradition with the same passion and integrity that has defined us from the beginning. Every tea in our collection is personally selected by our master tea buyers, who travel to the gardens each harvest season to taste and evaluate hundreds of lots — selecting only the top 2% for our discerning clientele.</p>
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


