import React, { useState } from 'react';
import {
  LogOut,
  ChevronDown,
  Calendar,
  Home,
  Menu,
  X,
  Compass
} from 'lucide-react';

export default function DashboardHeader({
  currentUser,
  currentView,
  onNavigate,
  onLogout,
  onGoToHome,
  onOpenDateModal,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPregnant = currentUser?.journey !== 'postnatal';

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F1]/95 backdrop-blur-md border-b border-[#EADFCF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: SakhiMaa Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#559C91] rounded-xl p-1 text-left cursor-pointer"
              aria-label="Return to Dashboard Overview"
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-[#EADFCF] p-1.5 flex items-center justify-center shadow-xs shadow-[#559C91]/10 transition-transform duration-300 group-hover:scale-105 group-hover:border-[#559C91]">
                <img src="/logo.png" alt="SakhiMaa Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#45362F] flex items-center gap-1.5">
                  SakhiMaa
                  <span className="inline-block w-2 h-2 rounded-full bg-[#559C91]"></span>
                </span>
                <span className="text-xs font-medium text-[#705B51] tracking-wide">
                  Maternal Healthcare Dashboard
                </span>
              </div>
            </button>
          </div>

          {/* Right: Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-4" aria-label="Dashboard Top Navigation">

            {/* Dashboard Overview Link */}
            <button
              onClick={() => onNavigate('dashboard')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${currentView === 'dashboard'
                  ? 'bg-[#EEF4EC] text-[#559C91] shadow-xs'
                  : 'text-[#705B51] hover:text-[#45362F] hover:bg-[#F7F1E8]'
                }`}
            >
              <Compass className="w-4 h-4 text-[#559C91]" />
              <span>Dashboard</span>
            </button>

            {/* Static Journey Stage Indicator Badge */}
            <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#EADFCF] flex items-center gap-1.5 shadow-2xs">
              <span className={`w-2 h-2 rounded-full ${isPregnant ? 'bg-[#559C91]' : 'bg-[#F08070]'}`} />
              <span className="text-[#45362F]">
                {isPregnant ? "I'm Pregnant" : "I've Delivered"}
              </span>
            </div>

            {/* View Home Page link */}
            <button
              onClick={onGoToHome}
              className="text-xs font-medium text-[#705B51] hover:text-[#45362F] transition-colors px-2 py-1 cursor-pointer flex items-center gap-1"
              title="Return to the home page"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home Page</span>
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-sm font-semibold text-[#45362F] bg-white border border-[#EADFCF] hover:border-[#559C91] shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#559C91]"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#559C91] to-[#F08070] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <span className="max-w-[120px] truncate">{currentUser?.name || 'Sakhi'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#705B51] transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Panel */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FFF9F1] border border-[#EADFCF] rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-[#EADFCF]/70">
                    <p className="text-[11px] font-semibold text-[#705B51] uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-[#45362F] truncate">{currentUser?.name || 'Sakhi'}</p>
                    <p className="text-xs text-[#705B51] truncate">{currentUser?.email || 'ananya@example.com'}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${isPregnant ? 'bg-[#EEF4EC] text-[#559C91]' : 'bg-[#FCECE5] text-[#F08070]'
                        }`}>
                        {isPregnant ? "I'm Pregnant" : "I've Delivered"}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onOpenDateModal) onOpenDateModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-[#45362F] hover:bg-[#F7F1E8] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-[#559C91]" />
                      <span>{isPregnant ? 'Update Due Date' : "Update Baby's Birth Date"}</span>
                    </button>

                    <div className="border-t border-[#EADFCF]/60 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-[#F08070] hover:bg-[#FCECE5]/60 flex items-center gap-2 cursor-pointer transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#45362F] hover:bg-[#F7F1E8] focus:outline-none focus:ring-2 focus:ring-[#559C91]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF9F1] border-b border-[#EADFCF] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">

          {/* User Info Bar */}
          <div className="p-3 bg-[#EEF4EC]/60 rounded-2xl border border-[#559C91]/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#705B51]">Signed in as</p>
              <p className="text-sm font-bold text-[#45362F]">{currentUser?.name || 'Sakhi'}</p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isPregnant ? 'bg-white text-[#559C91] border border-[#559C91]/30' : 'bg-white text-[#F08070] border border-[#F08070]/30'
              }`}>
              {isPregnant ? "Pregnant" : "Delivered"}
            </span>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pt-1">
            <button
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#45362F] hover:bg-[#F7F1E8] flex items-center gap-2.5"
            >
              <Compass className="w-4 h-4 text-[#559C91]" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenDateModal) onOpenDateModal();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#45362F] hover:bg-[#F7F1E8] flex items-center gap-2.5"
            >
              <Calendar className="w-4 h-4 text-[#559C91]" />
              <span>{isPregnant ? 'Update Due Date' : "Update Baby's Birth Date"}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGoToHome();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#705B51] hover:bg-[#F7F1E8] flex items-center gap-2.5"
            >
              <Home className="w-4 h-4" />
              <span>Home Page</span>
            </button>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-[#EADFCF]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#F08070] bg-[#FCECE5]/60 hover:bg-[#FCECE5] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
}
