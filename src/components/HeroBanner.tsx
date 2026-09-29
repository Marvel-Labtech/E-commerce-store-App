import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import heroTech from '../assets/images/hero_tech_lifestyle_1790672214272.jpg';
import heroFashion from '../assets/images/hero_fashion_luxury_1790672229887.jpg';
import heroHome from '../assets/images/hero_home_beauty_1790672242883.jpg';

interface HeroBannerProps {
  onCategoryClick: (categoryName: string) => void;
  onExploreClick: () => void;
}

const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Next-Gen Computing & Devices',
    title: 'Flagship Performance Designed for Modern Ambition',
    description:
      'Discover over 500+ authentic smartphones, ultrabooks, studio audio, and smart gear. Direct Moniepoint transfer checkout with rapid nationwide delivery.',
    image: heroTech,
    ctaText: 'Explore Tech & Electronics',
    category: 'Tech & Electronics',
    accentColor: 'from-indigo-900/90 via-indigo-950/70 to-transparent',
  },
  {
    id: 2,
    tag: 'Bespoke Sartorial Luxury',
    title: 'Contemporary African Elegance & Designer Streetwear',
    description:
      'From custom hand-tailored senator kaftans to limited-edition collector sneakers and Swiss-inspired automatic timepieces.',
    image: heroFashion,
    ctaText: 'Shop Fashion & Apparel',
    category: 'Fashion & Apparel',
    accentColor: 'from-slate-950/90 via-indigo-950/75 to-transparent',
  },
  {
    id: 3,
    tag: 'Aesthetic Living & Self-Care',
    title: 'Sanctuary Essentials for Home, Body, and Mind',
    description:
      'Curated Scandinavian decor, barista-grade espresso machinery, and dermatologist-approved active skincare formulated for radiant skin.',
    image: heroHome,
    ctaText: 'Discover Home & Beauty',
    category: 'Home & Lifestyle',
    accentColor: 'from-amber-950/85 via-slate-900/75 to-transparent',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ onCategoryClick, onExploreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl text-white my-4 sm:my-6">
      {/* Background Image Container */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] min-h-[380px] sm:min-h-[440px] w-full overflow-hidden">
        {HERO_SLIDES.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark Gradient Overlay for legible contrast */}
            <div className={`absolute inset-0 bg-gradient-to-r ${item.accentColor}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          </div>
        ))}

        {/* Slide Content */}
        <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-between max-w-3xl z-10">
          {/* Subtle editorial kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{slide.tag}</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span className="text-white/70">500+ In-Stock Items</span>
          </div>

          {/* Headline & Description with no orphan words */}
          <div className="my-auto py-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-tight max-w-2xl text-balance">
              {slide.title}
            </h1>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-none max-w-xl leading-relaxed">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onCategoryClick(slide.category)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all"
              >
                View Full Catalog
              </button>
            </div>
          </div>

          {/* Slide Navigation Dots and Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentSlide(
                    (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                  )
                }
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Adjacent Bar (Adhering to Claim-to-Proof Adjacency rule) */}
      <div className="bg-slate-950/95 border-t border-white/10 px-6 py-3.5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white leading-tight">Moniepoint Bank Transfer</p>
            <p className="text-[11px] text-slate-400">Direct 8132230017 with instant credit</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white leading-tight">500+ Catalog In-Stock</p>
            <p className="text-[11px] text-slate-400">Tech, Fashion, Home, Beauty, Food</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white leading-tight">100% Genuine Guaranteed</p>
            <p className="text-[11px] text-slate-400">Factory sealed with valid warranty</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white leading-tight">Fast Nationwide Dispatch</p>
            <p className="text-[11px] text-slate-400">Doorstep delivery to all 36 States + FCT</p>
          </div>
        </div>
      </div>
    </section>
  );
};
