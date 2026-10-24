import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  RefreshCw 
} from 'lucide-react';
import { getThoughtsForJourney } from '../../data/thoughtsData';

export default function MomentForYou({
  currentUser,
}) {
  const journey = currentUser?.journey || 'pregnant';

  // Available messages matching journey
  const availableThoughts = useMemo(() => {
    return getThoughtsForJourney(journey);
  }, [journey]);

  // Current active thought
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Sync index if journey changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [journey]);

  const currentThought = availableThoughts[currentIndex] || availableThoughts[0];

  // Handler for "Give Me Another Thought"
  const handleNextThought = () => {
    if (availableThoughts.length <= 1) return;
    setAnimating(true);

    setTimeout(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * availableThoughts.length);
      } while (nextIndex === currentIndex && availableThoughts.length > 1);

      setCurrentIndex(nextIndex);
      setAnimating(false);
    }, 200);
  };

  return (
    <section aria-labelledby="moment-heading" className="w-full">
      
      {/* Outer Banner Canvas with Botanical Background */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#FBF2EB] via-[#FAF0E7] to-[#FBF2EB] border border-[#F2E5DC] p-6 sm:p-8 md:p-10 shadow-xs">
        
        {/* Watercolor Botanical Floral Illustration on Left */}
        <img 
          src="/images/thought-flowers-left.png" 
          alt="" 
          aria-hidden="true"
          className="absolute left-0 bottom-0 w-36 sm:w-48 md:w-56 lg:w-64 h-auto max-h-[92%] object-contain object-bottom pointer-events-none select-none z-0 opacity-80 sm:opacity-95"
        />

        {/* Watercolor Peach Leaves on Right */}
        <img 
          src="/images/thought-leaves-right.png" 
          alt="" 
          aria-hidden="true"
          className="absolute right-0 bottom-0 w-20 sm:w-28 md:w-32 h-auto max-h-[80%] object-contain object-bottom pointer-events-none select-none z-0 opacity-70 sm:opacity-90"
        />

        {/* Banner Content Container */}
        <div className="relative z-10">
          
          {/* Header Area: Sunburst Heart Icon + Title + Subtitle */}
          <div className="space-y-1.5 max-w-xl sm:pl-2">
            <div className="flex items-center gap-3">
              
              {/* Radiating Sunburst Heart Emblem */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0" aria-hidden="true">
                <svg className="w-full h-full text-[#E07A5F]" viewBox="0 0 36 36" fill="none">
                  {/* Radiating sunburst rays */}
                  <line x1="18" y1="3" x2="18" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18" y1="29.5" x2="18" y2="33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="6.5" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="29.5" y1="18" x2="33" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="7.4" y1="7.4" x2="9.8" y2="9.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="26.2" y1="26.2" x2="28.6" y2="28.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="7.4" y1="28.6" x2="9.8" y2="26.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="26.2" y1="9.8" x2="28.6" y2="7.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  {/* Central Heart Outline */}
                  <path 
                    d="M18 24.5 C18 24.5 12 19 12 15.5 C12 13.2 13.6 11.5 15.7 11.5 C16.9 11.5 17.6 12.2 18 12.8 C18.4 12.2 19.1 11.5 20.3 11.5 C22.4 11.5 24 13.2 24 15.5 C24 19 18 24.5 18 24.5 Z" 
                    stroke="currentColor" 
                    strokeWidth="1.9" 
                    fill="none" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>

              {/* Title with Soft Outline Heart */}
              <h2 id="moment-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#362B26] tracking-tight flex items-center gap-2">
                <span>A Little Moment for You</span>
                <span className="text-[#E07A5F] font-light text-2xl sm:text-3xl">♡</span>
              </h2>

            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#705B51] leading-relaxed max-w-lg pl-12 sm:pl-13">
              Take a breath. These little reminders are here to bring a moment of calm, hope, and kindness to your day.
            </p>
          </div>

          {/* Inner Thought Card (Positioned gracefully offset from left flower) */}
          <div className="mt-6 sm:mt-8 ml-auto lg:max-w-[78%] xl:max-w-[75%] rounded-[1.75rem] bg-[#FCF4ED]/95 backdrop-blur-xs border border-[#F4DFD5] p-6 sm:p-7 md:p-8 shadow-xs hover:shadow-md transition-shadow relative">
            
            {/* Top Row: Category Badge & Sparkle Stars */}
            <div className="flex items-center justify-between pb-1">
              
              {/* Category Pill with Mini Heart */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEEDE7] text-[#D97D6E] border border-[#F6DCD2]">
                <Heart className="w-3.5 h-3.5 stroke-[2] text-[#D97D6E]" />
                <span>{currentThought?.category || 'Positive Thought'}</span>
              </div>

              {/* Delicate Sparkle Stars Flourish on Top Right */}
              <div className="flex items-center text-[#E07A5F]/70 pr-1 select-none" aria-hidden="true">
                <svg className="w-10 h-7" viewBox="0 0 40 28" fill="none">
                  {/* Subtle curving trail */}
                  <path d="M4 22 C14 18 26 12 34 6" stroke="#E07A5F" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
                  {/* Star 1 */}
                  <path d="M30 4 C30 6.5 32.5 6.5 32.5 6.5 C32.5 6.5 30 6.5 30 9 C30 6.5 27.5 6.5 27.5 6.5 C27.5 6.5 30 6.5 30 4 Z" fill="#E07A5F" />
                  {/* Star 2 */}
                  <path d="M22 13 C22 14.5 23.5 14.5 23.5 14.5 C23.5 14.5 22 14.5 22 16 C22 14.5 20.5 14.5 20.5 14.5 C20.5 14.5 22 14.5 22 13 Z" fill="#E07A5F" opacity="0.8" />
                </svg>
              </div>

            </div>

            {/* Thought Message with Opening Quotes */}
            <div className={`transition-opacity duration-200 ${animating ? 'opacity-20' : 'opacity-100'} space-y-2.5 pt-2`}>
              <blockquote className="font-serif italic font-medium text-xl sm:text-2xl md:text-[1.65rem] text-[#362B26] leading-snug tracking-tight">
                <span className="text-[#559C91]/50 text-2xl sm:text-3xl font-serif not-italic mr-1 select-none">&ldquo;</span>
                {currentThought?.quote}
                <span className="text-[#559C91]/50 text-2xl sm:text-3xl font-serif not-italic ml-0.5 select-none">&rdquo;</span>
              </blockquote>

              {currentThought?.supportingText && (
                <p className="text-xs sm:text-sm text-[#705B51] leading-relaxed font-normal pt-1">
                  {currentThought.supportingText}
                </p>
              )}
            </div>

            {/* Card Footer: Brand Sign-off & Give Me Another Thought Button */}
            <div className="pt-5 mt-4 border-t border-[#F0DED4]/60 flex flex-wrap items-center justify-between gap-3">
              
              {/* Left: Brand Love Note */}
              <div className="flex items-center gap-2 text-xs text-[#8C776D] font-normal">
                <Heart className="w-3.5 h-3.5 fill-[#E07A5F] text-[#E07A5F] shrink-0" />
                <span>A reminder from SakhiMaa, with love</span>
              </div>

              {/* Right: Give Me Another Thought Pill Button */}
              <button
                onClick={handleNextThought}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold text-[#D97D6E] hover:text-[#C46757] bg-[#FEECE6] hover:bg-[#FCDFD6] border border-[#F6DCD2] transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs group ml-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 transition-transform group-hover:rotate-45 ${animating ? 'animate-spin' : ''}`} />
                <span>Give Me Another Thought</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
