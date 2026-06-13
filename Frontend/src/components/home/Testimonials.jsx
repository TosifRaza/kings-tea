// ============================================================
// Frontend/src/components/home/Testimonials.jsx
// UPDATED: Replaced static import with Redux API fetch
// ============================================================
// INSTRUCTIONS: Replace your existing Testimonials.jsx with this file.
// Changes: Uses Redux state (state.testimonials) instead of static data.js
// ============================================================

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTestimonials } from '../../store/testimonialSlice';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-[#C9A86A]' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const dispatch = useDispatch();
  const { testimonials, loading, error } = useSelector((state) => state.testimonials);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const testimonialsList = testimonials || [];

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonialsList.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonialsList.length]);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1F4D3A]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[#C9A86A] text-sm font-semibold tracking-widest uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">What Our Royals Say</h2>
          <p className="text-white/70 mt-3">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (error || testimonialsList.length === 0) {
    return null;
  }

  // Get 3 testimonials to show (current + next 2)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < Math.min(3, testimonialsList.length); i++) {
      visible.push(testimonialsList[(currentIndex + i) % testimonialsList.length]);
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1F4D3A] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#C9A86A]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A86A]/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#C9A86A] text-sm font-semibold tracking-widest uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">What Our Royals Say</h2>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto">
            Hear from our community of tea lovers who have elevated their daily ritual with King's Tea.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleTestimonials.map((testimonial, idx) => (
            <div
              key={testimonial._id || idx}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300"
            >
              {/* Quote mark */}
              <div className="text-[#C9A86A] text-4xl font-serif mb-4">&ldquo;</div>

              {/* Quote text */}
              <p className="text-white/90 text-sm leading-relaxed mb-6 line-clamp-4">
                {testimonial.quote}
              </p>

              {/* Rating */}
              <StarRating rating={testimonial.rating} />

              {/* Author */}
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C9A86A]/20 flex items-center justify-center">
                  <span className="text-[#C9A86A] font-semibold text-sm">
                    {testimonial.name?.charAt(0) || 'T'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{testimonial.name}</p>
                  <p className="text-white/50 text-xs">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots navigation */}
        {testimonialsList.length > 3 && (
          <div className="flex justify-center mt-8 gap-2">
            {testimonialsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-[#C9A86A] w-6' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
