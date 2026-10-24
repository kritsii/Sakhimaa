import React from 'react';
import { Heart, ArrowDown, Sparkles, ShieldCheck, Flower2 } from 'lucide-react';

export default function Hero({ onChooseJourneyClick }) {
  const scrollToJourney = () => {
    if (onChooseJourneyClick) {
      onChooseJourneyClick();
    } else {
      const element = document.getElementById('journey-selection');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background Organic Ambient Blobs */}
      <div
        className="absolute top-10 left-1/4 w-96 h-96 bg-[#F4B49B]/15 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-10 w-80 h-80 bg-[#C7B8DD]/15 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-10 left-10 w-72 h-72 bg-[#A8BCA1]/15 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#45362F] leading-[1.15] tracking-tight">
              Every stage of motherhood deserves{' '}
              <span className="text-[#D98F96] relative inline-block underline decoration-[#F4B49B]/40 decoration-wavy decoration-from-font">
                a little more care.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#705B51] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Whether you&apos;re preparing to welcome your little one or navigating life after delivery, SakhiMaa brings thoughtful health tracking and everyday care guidance together in one comforting space.
            </p>

            {/* Primary CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-choose-journey-btn"
                onClick={scrollToJourney}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-white bg-[#D98F96] hover:bg-[#C67981] shadow-lg shadow-[#D98F96]/25 hover:shadow-xl hover:shadow-[#D98F96]/30 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#D98F96]/30"
              >
                <span>Choose Your Journey</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>

            {/* Gentle Trust Indicators */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 border-t border-[#EADFCF]/70">
              <div className="text-left">
                <div className="font-serif text-lg font-bold text-[#45362F]">Mother First</div>
                <div className="text-xs text-[#705B51]">Your wellbeing matters at every step.</div>
              </div>
              <div className="text-left border-l border-[#EADFCF] pl-3">
                <div className="font-serif text-lg font-bold text-[#45362F]">Care you can trust</div>
                <div className="text-xs text-[#705B51]">Guidance grounded in trusted health information.</div>
              </div>
              <div className="text-left border-l border-[#EADFCF] pl-3">
                <div className="font-serif text-lg font-bold text-[#45362F]">Here for both</div>
                <div className="text-xs text-[#705B51]">Support for you and your little one.</div>
              </div>
            </div>

          </div>

          {/* Right Column: Mother & Baby Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">

            {/* Soft Peach Organic Background Wrapper */}
            <div className="relative w-full max-w-md sm:max-w-lg mx-auto">

              {/* Organic shape background frame */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-[#F4B49B]/35 via-[#FFF9F1] to-[#D98F96]/25 rounded-[2.5rem] transform rotate-2 scale-105 filter blur-xs -z-10"
                aria-hidden="true"
              />

              {/* Decorative mini flowers & hearts */}
              <div className="absolute -top-4 -left-3 z-20 bg-[#FFF9F1] p-2.5 rounded-full shadow-md text-[#D98F96] border border-[#F4B49B]/30 animate-pulse">
                <Flower2 className="w-5 h-5 text-[#D98F96]" />
              </div>
              <div className="absolute top-1/4 -right-3 z-20 bg-[#FFF9F1] p-2 rounded-full shadow-md text-[#F4B49B] border border-[#F4B49B]/30">
                <Heart className="w-4 h-4 fill-[#F4B49B]" />
              </div>

              {/* Main Illustration Container */}
              <div className="relative rounded-[2rem] overflow-hidden border-4 border-[#FFF9F1] shadow-2xl shadow-[#45362F]/10 group">
                <img
                  src="/images/hero-mother.jpg"
                  alt="An Indian mother holding her newborn baby in warm golden sunlight"
                  className="w-full h-auto object-cover object-[center_30%] aspect-[3/2] sm:aspect-[4/3] transform transition-transform duration-700 group-hover:scale-102"
                  loading="eager"
                />

                {/* Gentle gradient overlay at base for text contrast */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#45362F]/30 to-transparent pointer-events-none" />
              </div>

              {/* Required Floating Message Card */}






            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
