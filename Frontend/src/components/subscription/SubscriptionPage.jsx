import { motion } from 'framer-motion';
import { Check, Crown, Gift, Truck, Star, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubscriptionPlans } from '../../store/subscriptionSlice';
import { fetchTestimonials } from '../../store/testimonialSlice';
import { Link } from 'react-router-dom';

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

const gradientMap = {
  'from-amber-700 to-amber-500': 'bg-gradient-to-br from-amber-700 to-amber-500',
  'from-emerald-700 to-emerald-500': 'bg-gradient-to-br from-emerald-700 to-emerald-500',
  'from-red-800 to-red-600': 'bg-gradient-to-br from-red-800 to-red-600',
};

const periodLabels = {
  month: 'Monthly',
  quarter: 'Quarterly',
  year: 'Annually',
};

export default function SubscriptionPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector((state) => state.subscriptions);
  const { testimonials } = useSelector((state) => state.testimonials);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const plansList = Array.isArray(plans) ? plans : [];
  const testimonialsList = Array.isArray(testimonials) ? testimonials : [];

  // Loading state
  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen">
        <div className="relative h-[45vh] min-h-[350px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F4D3A]/80 to-[#3A281C]/80" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <Crown className="h-8 w-8 text-[#C9A86A] mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">KING'S TEA Society</h1>
            <p className="text-[#F8F3E9]/70 text-lg max-w-xl">Loading subscription plans...</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] rounded-sm bg-[#1F4D3A]/10 animate-pulse"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Pick a featured testimonial (safely)
  const featuredTestimonial = testimonialsList.find((t) => t.featured) || testimonialsList[0] || null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen">
      {/* ===== HERO ===== */}
      <div className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/subscription-box.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F4D3A]/80 to-[#3A281C]/80" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <Crown className="h-8 w-8 text-[#C9A86A] mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">KING'S TEA Society</h1>
          <p className="text-[#F8F3E9]/70 text-lg max-w-xl">Join our exclusive tea subscription and experience the world's finest teas, delivered monthly to your door.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* ===== WHAT'S INCLUDED ===== */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#C9A86A] text-xs font-semibold uppercase tracking-[0.2em]">Every Box Contains</span>
            <h2 className="text-3xl font-bold text-[#3A281C] mt-3">What's Included</h2>
            <div className="w-16 h-0.5 bg-[#C9A86A] mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {included.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#1F4D3A]/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-[#1F4D3A]" />
                </div>
                <h3 className="font-semibold text-[#3A281C] text-sm mb-1">{item.title}</h3>
                <p className="text-[#3A281C]/50 text-xs">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== SUBSCRIPTION PLANS ===== */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-[#C9A86A] text-xs font-semibold uppercase tracking-[0.2em]">Choose Your Journey</span>
            <h2 className="text-3xl font-bold text-[#3A281C] mt-3">Subscription Plans</h2>
            <div className="w-16 h-0.5 bg-[#C9A86A] mx-auto mt-4" />
          </div>

          {error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#A65A3A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-[#A65A3A]" />
              </div>
              <h3 className="text-xl font-bold text-[#3A281C] mb-2">Unable to Load Plans</h3>
              <p className="text-[#3A281C]/60 mb-4">We couldn't fetch the subscription plans. Please try again.</p>
              <button
                onClick={() => dispatch(fetchSubscriptionPlans())}
                className="bg-[#1F4D3A] text-white px-6 py-3 rounded-sm font-semibold hover:bg-[#1F4D3A]/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : plansList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#C9A86A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-[#C9A86A]" />
              </div>
              <h3 className="text-xl font-bold text-[#3A281C] mb-2">Coming Soon</h3>
              <p className="text-[#3A281C]/60 mb-4">Our subscription plans are being curated with care. Check back soon!</p>
              <Link
                to="/shop"
                className="bg-[#1F4D3A] text-white px-6 py-3 rounded-sm font-semibold hover:bg-[#1F4D3A]/90 transition-colors inline-block"
              >
                Browse Our Teas
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plansList.map((plan, i) => {
                const gradientClass = plan.gradientColor
                  ? gradientMap[plan.gradientColor] || 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70'
                  : 'bg-gradient-to-br from-[#1F4D3A] to-[#1F4D3A]/70';

                return (
                  <motion.div
                    key={plan._id || plan.id || plan.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={`relative rounded-sm overflow-hidden ${
                      plan.popular
                        ? 'bg-white ring-2 ring-[#C9A86A] shadow-lg md:-mt-4 md:mb-[-16px]'
                        : 'bg-white border border-[#C9A86A]/10'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-[#C9A86A] text-[#3A281C] text-center text-[10px] font-bold uppercase tracking-widest py-1.5 flex items-center justify-center gap-1">
                        <Crown className="h-3 w-3" /> Most Popular
                      </div>
                    )}
                    <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                      <h3 className="font-semibold text-lg text-[#3A281C] mb-1">{plan.name}</h3>
                      <p className="text-[#3A281C]/50 text-xs mb-4">
                        {periodLabels[plan.period] || plan.period || 'Subscription'}
                      </p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-[#1F4D3A]">
                          ₹{plan.price?.toLocaleString()}
                        </span>
                        {plan.period && (
                          <span className="text-[#3A281C]/40 text-xs">/{plan.period}</span>
                        )}
                        {plan.comparePrice && (
                          <span className="text-[#3A281C]/40 text-xs line-through ml-2">
                            ₹{plan.comparePrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <ul className="space-y-3 mb-8">
                        {(plan.features || []).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-[#1F4D3A] flex-shrink-0 mt-0.5" />
                            <span className="text-[#3A281C]/70 text-xs leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className={`w-full py-4 text-xs font-semibold uppercase tracking-widest rounded-none transition-colors ${
                          plan.popular
                            ? 'bg-[#1F4D3A] hover:bg-[#1F4D3A]/90 text-[#F8F3E9]'
                            : 'bg-[#F8F3E9] hover:bg-[#F8F3E9]/80 text-[#3A281C]'
                        }`}
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* ===== FAQ ===== */}
        <section className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-12">
            <span className="text-[#C9A86A] text-xs font-semibold uppercase tracking-[0.2em]">Questions</span>
            <h2 className="text-3xl font-bold text-[#3A281C] mt-3">Frequently Asked Questions</h2>
            <div className="w-16 h-0.5 bg-[#C9A86A] mx-auto mt-4" />
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-[#C9A86A]/10 rounded-sm px-6">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left text-sm font-medium text-[#3A281C] hover:text-[#1F4D3A] py-4 flex justify-between items-center"
                >
                  {faq.question}
                  <span className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openFaq === i && (
                  <p className="text-[#3A281C]/60 text-xs leading-relaxed pb-4">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== TESTIMONIAL ===== */}
        {featuredTestimonial && (
          <section className="max-w-2xl mx-auto text-center">
            <div className="bg-white p-8 rounded-sm border border-[#C9A86A]/10">
              <Star className="h-5 w-5 text-[#C9A86A] mx-auto mb-4" />
              <p className="text-lg text-[#3A281C]/80 italic leading-relaxed mb-6">
                &ldquo;{featuredTestimonial.quote}&rdquo;
              </p>
              <p className="font-semibold text-[#3A281C] text-sm">{featuredTestimonial.name}</p>
              <p className="text-[#3A281C]/40 text-xs">{featuredTestimonial.location}</p>
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}