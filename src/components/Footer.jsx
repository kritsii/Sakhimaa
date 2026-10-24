import React from 'react';
import { Heart, ShieldAlert, Mail, MapPin, Sparkles } from 'lucide-react';

export default function Footer({ onSelectJourney }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#F7F1E8] border-t border-[#EADFCF] pt-16 pb-12 text-[#45362F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid: Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF9F1] border border-[#EADFCF] p-1.5 flex items-center justify-center shadow-xs">
                <img src="/logo.png" alt="SakhiMaa Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#45362F]">
                  SakhiMaa
                </span>
                <p className="text-xs font-medium text-[#705B51]">
                  Care for her. Care for them.
                </p>
              </div>
            </div>

            <p className="text-sm text-[#705B51] leading-relaxed max-w-sm">
              A caring maternal and newborn companion designed to bring peace of mind, thoughtful health tracking, and evidence-based guidance to every stage of motherhood.
            </p>

            <div className="space-y-1.5 text-xs text-[#705B51]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D98F96]" />
                <span>support@sakhimaa.care</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D98F96]" />
                <span>Maternal Care Support • Bangalore &amp; New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-[#45362F]">
              Motherhood Journeys
            </h4>
            <ul className="space-y-2 text-sm text-[#705B51]">
              <li>
                <button
                  onClick={() => {
                    onSelectJourney('pregnant');
                    scrollTo('pregnancy-section');
                  }}
                  className="hover:text-[#D98F96] transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4B49B]"></span>
                  <span>I&apos;m Pregnant (Antenatal Care)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectJourney('postnatal');
                    scrollTo('postnatal-section');
                  }}
                  className="hover:text-[#5F7C58] transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A8BCA1]"></span>
                  <span>I&apos;ve Delivered (Postpartum Care)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('journey-selection')}
                  className="hover:text-[#D98F96] transition-colors cursor-pointer text-left"
                >
                  Choose Stage
                </button>
              </li>
            </ul>
          </div>

          {/* About & Trust */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-[#45362F]">
              Companion Resources
            </h4>
            <ul className="space-y-2 text-sm text-[#705B51]">
              <li>
                <button
                  onClick={() => scrollTo('about-section')}
                  className="hover:text-[#D98F96] transition-colors cursor-pointer"
                >
                  About SakhiMaa &amp; Our Care Philosophy
                </button>
              </li>
              <li>
                <a href="#privacy" className="hover:text-[#D98F96] transition-colors">
                  Privacy Policy &amp; Health Data Protection
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#D98F96] transition-colors">
                  Terms of Compassionate Care
                </a>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-[#D98F96] transition-colors">
                  Clinical Evidence Standards
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Mandatory Medical Disclaimer */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF9F1] border border-[#EADFCF] shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#FCECE5] text-[#D98F96] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-semibold text-xs uppercase tracking-wider text-[#45362F]">
                Medical Disclaimer
              </h5>
              <p className="text-xs sm:text-sm text-[#705B51] leading-relaxed">
                “SakhiMaa provides health tracking and supportive educational information. It does not replace professional medical advice, diagnosis, or emergency care.”
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-[#EADFCF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#705B51]">
          <p>© {new Date().getFullYear()} SakhiMaa Companion. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-[#D98F96] text-[#D98F96]" />
            <span>for mothers and their precious little ones</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
