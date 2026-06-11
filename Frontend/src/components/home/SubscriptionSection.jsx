import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Check, Crown } from 'lucide-react';
import { subscriptionPlans } from '../../assets/data';

export default function SubscriptionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedPlan, setSelectedPlan] = useState('quarterly');

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-tea-green relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201,168,106,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-imperial-gold text-xs font-semibold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
            Exclusive Membership
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-warm-ivory mt-3">
            KING&apos;S TEA Society
          </h2>
          <p className="text-warm-ivory/60 font-[family-name:var(--font-inter)] text-sm mt-3 max-w-xl mx-auto">
            Join our exclusive tea subscription and receive curated selections of
            the world&apos;s finest teas, delivered to your door with tasting
            notes and brewing guides.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {subscriptionPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-sm overflow-hidden ${
                plan.popular
                  ? 'bg-warm-ivory ring-2 ring-imperial-gold md:-mt-4 md:mb-[-16px]'
                  : 'bg-warm-ivory/10 backdrop-blur-sm border border-warm-ivory/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-imperial-gold text-deep-walnut text-center text-[10px] font-bold uppercase tracking-widest py-1.5 flex items-center justify-center gap-1">
                  <Crown className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                <h3
                  className={`font-[family-name:var(--font-playfair)] font-semibold text-lg mb-1 ${
                    plan.popular ? 'text-deep-walnut' : 'text-warm-ivory'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-xs mb-4 font-[family-name:var(--font-inter)] ${
                    plan.popular ? 'text-deep-walnut/60' : 'text-warm-ivory/50'
                  }`}
                >
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className={`font-[family-name:var(--font-playfair)] text-3xl font-bold ${
                      plan.popular ? 'text-tea-green' : 'text-imperial-gold'
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-xs font-[family-name:var(--font-inter)] ${
                      plan.popular ? 'text-deep-walnut/50' : 'text-warm-ivory/50'
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-tea-green' : 'text-imperial-gold'
                        }`}
                      />
                      <span
                        className={`text-xs font-[family-name:var(--font-inter)] leading-relaxed ${
                          plan.popular ? 'text-deep-walnut/70' : 'text-warm-ivory/70'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-4 text-xs font-semibold uppercase tracking-widest rounded-none transition-colors ${
                    plan.popular
                      ? 'bg-tea-green hover:bg-tea-green-dark text-warm-ivory'
                      : 'bg-imperial-gold/20 hover:bg-imperial-gold/30 text-imperial-gold border border-imperial-gold/30'
                  }`}
                >
                  Subscribe Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-8">
            <img
              src="/images/subscription-box.png"
              alt="KING'S TEA subscription box"
              className="h-32 object-contain opacity-80"
            />
            <div className="text-warm-ivory/60 text-sm font-[family-name:var(--font-inter)]">
              <p className="font-semibold text-warm-ivory mb-1">
                What&apos;s in the box?
              </p>
              <p>
                Premium tea samples • Tasting notes • Brewing guide • Exclusive
                gifts
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
