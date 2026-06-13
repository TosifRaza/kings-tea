// ============================================================
// Frontend/src/components/home/SubscriptionSection.jsx
// UPDATED: Replaced static import with Redux API fetch
// ============================================================
// INSTRUCTIONS: Replace your existing SubscriptionSection.jsx with this file.
// Changes: Uses Redux state (state.subscriptions) instead of static data.js
// ============================================================

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSubscriptionPlans } from '../../store/subscriptionSlice';
import { Link } from 'react-router-dom';

const SubscriptionSection = () => {
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const plansList = plans || [];

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F3E9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C9A86A] text-sm font-semibold tracking-widest uppercase">Subscriptions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4D3A] mt-2">Royal Tea Club</h2>
            <p className="text-[#3A281C]/70 mt-3">Loading subscription plans...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#1F4D3A]/10 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || plansList.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F3E9]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#C9A86A] text-sm font-semibold tracking-widest uppercase">Subscriptions</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F4D3A] mt-2">Royal Tea Club</h2>
          <p className="text-[#3A281C]/70 mt-3 max-w-2xl mx-auto">
            Join our exclusive tea club and receive hand-selected premium teas delivered to your door. Each box is curated by our tea masters for a truly royal experience.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plansList.map((plan) => {
            const gradientMap = {
              'from-amber-700 to-amber-500': 'bg-gradient-to-br from-amber-700 to-amber-500',
              'from-emerald-700 to-emerald-500': 'bg-gradient-to-br from-emerald-700 to-emerald-500',
              'from-red-800 to-red-600': 'bg-gradient-to-br from-red-800 to-red-600',
            };

            const gradientClass = plan.gradientColor
              ? gradientMap[plan.gradientColor] || 'bg-gradient-to-br from-amber-700 to-amber-500'
              : 'bg-gradient-to-br from-amber-700 to-amber-500';

            const periodLabel = {
              month: 'Monthly',
              quarter: 'Quarterly',
              year: 'Annually',
            };

            return (
              <div
                key={plan._id || plan.id}
                className={`relative rounded-2xl overflow-hidden ${
                  plan.popular ? 'ring-2 ring-[#C9A86A] shadow-xl scale-105' : 'shadow-lg'
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4 bg-[#C9A86A] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    Most Popular
                  </div>
                )}

                {/* Header with gradient */}
                <div className={`${gradientClass} p-6 text-white`}>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{periodLabel[plan.period] || plan.period}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ₹{plan.price?.toLocaleString()}
                    </span>
                    {plan.comparePrice && (
                      <span className="text-white/60 line-through text-sm">
                        ₹{plan.comparePrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="bg-white p-6">
                  <p className="text-[#3A281C]/70 text-sm mb-6">{plan.description}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {(plan.features || []).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#3A281C]">
                        <svg className="w-5 h-5 text-[#1F4D3A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    to="/subscription"
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-[#1F4D3A] text-white hover:bg-[#1F4D3A]/90'
                        : 'bg-[#F8F3E9] text-[#1F4D3A] border-2 border-[#1F4D3A] hover:bg-[#1F4D3A] hover:text-white'
                    }`}
                  >
                    Choose Plan
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-8">
          <p className="text-[#3A281C]/50 text-sm">
            All subscriptions include free shipping. Cancel or modify anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
