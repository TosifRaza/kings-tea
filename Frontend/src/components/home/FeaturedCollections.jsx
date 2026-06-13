// ============================================================
// Frontend/src/components/home/FeaturedCollections.jsx
// UPDATED: Replaced static import with Redux API fetch
// ============================================================
// INSTRUCTIONS: Replace your existing FeaturedCollections.jsx with this file.
// Changes: Uses Redux state (state.collections) instead of static data.js
// ============================================================

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCollections } from '../../store/collectionSlice';
import { Link } from 'react-router-dom';

const CollectionCard = ({ collection }) => {
  const gradientMap = {
    'from-emerald-800 to-emerald-600': 'bg-gradient-to-br from-emerald-800 to-emerald-600',
    'from-amber-800 to-amber-600': 'bg-gradient-to-br from-amber-800 to-amber-600',
    'from-teal-800 to-teal-600': 'bg-gradient-to-br from-teal-800 to-teal-600',
    'from-red-800 to-red-600': 'bg-gradient-to-br from-red-800 to-red-600',
  };

  const gradientClass = collection.gradientColor
    ? gradientMap[collection.gradientColor] || 'bg-gradient-to-br from-amber-800 to-amber-600'
    : 'bg-gradient-to-br from-amber-800 to-amber-600';

  const icons = {
    'By Origin': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'By Fermentation': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'By Season': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };

  const icon = icons[collection.name] || icons['By Origin'];

  return (
    <Link
      to={`/shop?collection=${collection.slug || collection._id}`}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 ${gradientClass} transition-transform duration-500 group-hover:scale-110`}></div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-24 h-24 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-8 left-6 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 border border-white/20 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
        <div className="flex justify-between items-start">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            {icon}
          </div>
          {collection.itemCount > 0 && (
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {collection.itemCount} Teas
            </span>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">
            {collection.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2 group-hover:text-white/95 transition-colors">
            {collection.description}
          </p>
          <div className="mt-3 flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-colors">
            Explore Collection
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeaturedCollections = () => {
  const dispatch = useDispatch();
  const { collections, loading, error } = useSelector((state) => state.collections);

  useEffect(() => {
    dispatch(fetchCollections({ featured: 'true' }));
  }, [dispatch]);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F3E9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4D3A]">Curated Collections</h2>
            <p className="text-[#3A281C]/70 mt-3">Loading collections...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-[#1F4D3A]/10 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F3E9]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F4D3A]">Curated Collections</h2>
          <p className="text-[#A65A3A] mt-3">Failed to load collections. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F3E9]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#C9A86A] text-sm font-semibold tracking-widest uppercase">Discover</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F4D3A] mt-2">Curated Collections</h2>
          <p className="text-[#3A281C]/70 mt-3 max-w-2xl mx-auto">
            Explore our carefully curated tea collections, each telling a unique story of terroir, tradition, and taste.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection._id || collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
