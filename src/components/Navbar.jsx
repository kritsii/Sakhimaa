import React, { useState } from 'react';
import { Heart, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export default function Navbar({ onSelectJourney, onOpenGetStarted }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F1E8]/90 backdrop-blur-md border-b border-[#EADFCF] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo & Tagline */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#D98F96] rounded-xl p-1"
            aria-label="SakhiMaa Home"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F4B49B] to-[#D98F96] flex items-center justify-center text-white shadow-md shadow-[#D98F96]/20 transition-transform duration-300 group-hover:scale-105">
              <Heart className="w-6 h-6 fill-white stroke-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#45362F] flex items-center gap-1.5">
                SakhiMaa
                <span className="inline-block w-2 h-2 rounded-full bg-[#D98F96]"></span>
              </span>
              <span className="text-xs font-medium text-[#705B51] tracking-wide">
                Care for her. Care for them.
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#45362F]" aria-label="Main Navigation">
            <button
              onClick={() => scrollTo('hero')}
              className="hover:text-[#D98F96] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D98F96] rounded-md px-1 py-0.5 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('journey-selection')}
              className="hover:text-[#D98F96] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D98F96] rounded-md px-1 py-0.5 cursor-pointer"
            >
              Choose Journey
            </button>
            <button
              onClick={() => scrollTo('about-section')}
              className="hover:text-[#D98F96] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D98F96] rounded-md px-1 py-0.5 cursor-pointer"
            >
              About Us
            </button>
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              id="navbar-get-started-btn"
              onClick={onOpenGetStarted}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#D98F96] hover:bg-[#C67981] shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D98F96] cursor-pointer"
            >

              <span>Get Started</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#45362F] hover:bg-[#FFF9F1] focus:outline-none focus:ring-2 focus:ring-[#D98F96]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF9F1] border-b border-[#EADFCF] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          <button
            onClick={() => scrollTo('hero')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-[#45362F] hover:bg-[#F7F1E8] rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('journey-selection')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-[#45362F] hover:bg-[#F7F1E8] rounded-lg"
          >
            Choose Journey
          </button>
          <button
            onClick={() => scrollTo('about-section')}
            className="block w-full text-left px-3 py-2 text-base font-medium text-[#45362F] hover:bg-[#F7F1E8] rounded-lg"
          >
            About Us
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGetStarted();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-base font-semibold text-white bg-[#D98F96] hover:bg-[#C67981] shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
