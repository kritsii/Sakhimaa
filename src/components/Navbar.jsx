import React, { useState } from 'react';
import { Menu, X, ArrowRight, Sparkles, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

export default function Navbar({ onSelectJourney, onOpenGetStarted, currentUser, onLogout, onGoToDashboard }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
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
            <div className="w-11 h-11 rounded-2xl bg-[#FFF9F1] border border-[#EADFCF] p-1.5 flex items-center justify-center shadow-xs shadow-[#D98F96]/10 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-[#D98F96]/40">
              <img src="/logo.png" alt="SakhiMaa Logo" className="w-full h-full object-contain" />
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

          {/* Action CTA or Authenticated User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold text-[#45362F] bg-white border border-[#EADFCF] hover:border-[#D98F96] shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D98F96]"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F4B49B] to-[#D98F96] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <span className="max-w-[130px] truncate">{currentUser.name || 'Sakhi'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#705B51] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#FFF9F1] border border-[#EADFCF] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-[#EADFCF]/70">
                      <p className="text-[11px] font-medium text-[#705B51] uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-[#45362F] truncate">{currentUser.name}</p>
                      <p className="text-xs text-[#705B51] truncate">{currentUser.email}</p>
                      <div className="mt-1.5">
                        <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FCECE5] text-[#D98F96]">
                          {currentUser.journey === 'postnatal' ? 'Postnatal Care' : 'Pregnancy Care'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {onGoToDashboard && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onGoToDashboard();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-[#45362F] hover:bg-[#FCECE5]/60 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#D98F96]" />
                          <span className="font-medium">Open Dashboard</span>
                        </button>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-[#D98F96] hover:bg-[#FCECE5]/60 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="navbar-get-started-btn"
                onClick={onOpenGetStarted}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#D98F96] hover:bg-[#C67981] shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D98F96] cursor-pointer"
              >
                <span>Get Started</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
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
          {currentUser && (
            <div className="p-3 bg-[#FCECE5]/50 rounded-xl border border-[#D98F96]/30 mb-2">
              <p className="text-xs text-[#705B51]">Signed in as</p>
              <p className="text-sm font-bold text-[#45362F]">{currentUser.name}</p>
              <p className="text-xs text-[#705B51]">{currentUser.email}</p>
            </div>
          )}

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

          <div className="pt-2 space-y-2">
            {currentUser ? (
              <>
                {onGoToDashboard && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGoToDashboard();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-base font-semibold text-white bg-[#D98F96] hover:bg-[#C67981] shadow-sm cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open Dashboard</span>
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-base font-semibold text-[#D98F96] bg-white border border-[#D98F96] hover:bg-[#FCECE5]/50 shadow-sm cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGetStarted();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-base font-semibold text-white bg-[#D98F96] hover:bg-[#C67981] shadow-sm cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
