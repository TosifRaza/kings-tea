import { motion } from 'framer-motion';
import { Check, Crown, Gift, Truck, Star, Clock } from 'lucide-react';
import { useState } from 'react';
import { subscriptionPlans, testimonials } from '../../assets/data';

const faqs = [
  { question: 'What teas are included in the subscription?', answer: 'Each box features a curated selection of our finest teas, varying by season and availability. Monthly boxes include 3 teas, Quarterly boxes include 6 teas, and Annual boxes include 8 teas per quarter.' },
  { question: 'Can I customize my subscription box?', answer: 'Our tea experts curate each box to provide the best experience, but Annual Connoisseur members receive a personal consultation to tailor selections to their preferences.' },
  { question: 'When will my subscription box ship?', answer: 'Monthly boxes ship on the 1st of each month. Quarterly boxes ship in January, April, July, and October.' },
  { question: 'Can I pause or cancel my subscription?', answer: 'You can pause your subscription at any time for up to 3 months. Monthly subscriptions can be cancelled at any time with 30 days notice.' },
  { question: 'Is shipping included in the subscription price?', answer: 'Yes, all subscription plans include free shipping. Annual Connoisseur members receive free express shipping worldwide.' },
];

const included = [
  { icon: Gift, title: 'Premium Teas', description: "Hand-selected from the world's finest gardens" },
  { icon: Star, title: 'Tasting Notes', description: 'Detailed flavor profiles and origins' },
  { icon: Clock, title: 'Brewing Guides', description: 'Precise instructions for perfect cups' },
  { icon: Truck, title: 'Free Shipping', description: 'Delivered to your door at no extra cost' },
];

export default function SubscriptionPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen">
      <div className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/subscription-box.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-tea-green/80 to-deep-walnut/80" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Crown className="h-8 w-8 text-imperial-gold mb-4" />
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-white mb-4">KING&apos;S TEA Society</h1>
          <p className="text-warm-ivory/70 font-[family-name:var(--font-cormorant)] text-lg max-w-xl">Join our exclusive tea subscription and experience the world&apos;s finest teas, delivered monthly to your door.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Every Box Contains</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">What&apos;s Included</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {included.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-full bg-tea-green/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-tea-green" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm mb-1">{item.title}</h3>
                <p className="text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Choose Your Journey</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">Subscription Plans</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className={`relative rounded-sm overflow-hidden ${plan.popular ? 'bg-white ring-2 ring-imperial-gold shadow-lg md:-mt-4 md:mb-[-16px]' : 'bg-white border border-imperial-gold/10'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-imperial-gold text-deep-walnut text-center text-[10px] font-bold uppercase tracking-widest py-1.5 flex items-center justify-center gap-1">
                    <Crown className="h-3 w-3" /> Most Popular
                  </div>
                )}
                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-lg text-deep-walnut mb-1">{plan.name}</h3>
                  <p className="text-deep-walnut/50 text-xs font-[family-name:var(--font-inter)] mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-tea-green">${plan.price}</span>
                    <span className="text-deep-walnut/40 text-xs font-[family-name:var(--font-inter)]">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-tea-green flex-shrink-0 mt-0.5" />
                        <span className="text-deep-walnut/70 text-xs font-[family-name:var(--font-inter)] leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 text-xs font-semibold uppercase tracking-widest rounded-none transition-colors ${plan.popular ? 'bg-tea-green hover:bg-tea-green-dark text-warm-ivory' : 'bg-warm-ivory-dark hover:bg-warm-ivory text-deep-walnut'}`}>
                    Subscribe Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-12">
            <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">Questions</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-deep-walnut mt-3">Frequently Asked Questions</h2>
            <div className="section-divider mt-4" />
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-imperial-gold/10 rounded-sm px-6">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left font-[family-name:var(--font-inter)] text-sm font-medium text-deep-walnut hover:text-tea-green py-4 flex justify-between items-center"
                >
                  {faq.question}
                  <span className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openFaq === i && (
                  <p className="text-deep-walnut/60 text-xs font-[family-name:var(--font-inter)] leading-relaxed pb-4">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto text-center">
          <div className="bg-white p-8 rounded-sm border border-imperial-gold/10">
            <Star className="h-5 w-5 text-imperial-gold mx-auto mb-4" />
            <p className="font-[family-name:var(--font-cormorant)] text-lg text-deep-walnut/80 italic leading-relaxed mb-6">
              &ldquo;{testimonials[2].quote}&rdquo;
            </p>
            <p className="font-[family-name:var(--font-playfair)] font-semibold text-deep-walnut text-sm">{testimonials[2].name}</p>
            <p className="text-deep-walnut/40 text-xs font-[family-name:var(--font-inter)]">{testimonials[2].location}</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
