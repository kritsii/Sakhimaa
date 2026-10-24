import React, { useState, useEffect } from 'react';
import { X, Heart, Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function GetStartedModal({ isOpen, onClose, initialJourney, onCompleteJourney }) {
  const [journey, setJourney] = useState(initialJourney || 'pregnant');
  const [name, setName] = useState('');
  const [stageDetail, setStageDetail] = useState('Trimester 2 (14–27 Weeks)');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialJourney) {
      setJourney(initialJourney);
    }
  }, [initialJourney]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onCompleteJourney(journey);
      onClose();
      setSubmitted(false);
      const targetId = journey === 'pregnant' ? 'pregnancy-section' : 'postnatal-section';
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#45362F]/40 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative w-full max-w-lg bg-[#FFF9F1] rounded-3xl border-2 border-[#EADFCF] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#45362F] transition-all"
      >
        {/* Decorative subtle background blob */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#F4B49B]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#705B51] hover:bg-[#F7F1E8] hover:text-[#45362F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D98F96] cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCECE5] text-[#D98F96] text-xs font-semibold uppercase">
                <Heart className="w-3.5 h-3.5 fill-[#D98F96]" />
                <span>WELCOME TO SAKHIMAA</span>
              </div>
              <h3 id="modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#45362F]">
                Start Your Personal Care Space
              </h3>
              <p className="text-xs sm:text-sm text-[#705B51]">
                Tell us where you are in your journey so we can tailor your daily companion guidance.
              </p>
            </div>

            {/* Mother's Name */}
            <div>
              <label htmlFor="user-name" className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                What should we call you? (Optional)
              </label>
              <input
                id="user-name"
                type="text"
                placeholder="e.g., Ananya or Maa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none transition-all placeholder:text-[#9E8B81]"
              />
            </div>

            {/* Primary Journey Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase text-[#45362F] mb-2">
                Choose Your Journey
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setJourney('pregnant');
                    setStageDetail('Trimester 2 (14–27 Weeks)');
                  }}
                  className={`p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                    journey === 'pregnant'
                      ? 'bg-[#FCECE5] border-2 border-[#D98F96] shadow-xs'
                      : 'bg-white border-[#EADFCF] hover:bg-[#FCECE5]/40'
                  }`}
                >
                  <span className="block font-serif font-bold text-sm text-[#45362F]">
                    I&apos;m Pregnant
                  </span>
                  <span className="block text-[11px] text-[#705B51] mt-0.5">
                    Antenatal &amp; Trimester care
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJourney('postnatal');
                    setStageDetail('First 6 Weeks Postpartum');
                  }}
                  className={`p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                    journey === 'postnatal'
                      ? 'bg-[#EEF4EC] border-2 border-[#5F7C58] shadow-xs'
                      : 'bg-white border-[#EADFCF] hover:bg-[#EEF4EC]/40'
                  }`}
                >
                  <span className="block font-serif font-bold text-sm text-[#45362F]">
                    I&apos;ve Delivered
                  </span>
                  <span className="block text-[11px] text-[#705B51] mt-0.5">
                    Recovery &amp; Newborn care
                  </span>
                </button>
              </div>
            </div>

            {/* Stage specifics */}
            <div>
              <label htmlFor="stage-detail" className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                Current Stage
              </label>
              <select
                id="stage-detail"
                value={stageDetail}
                onChange={(e) => setStageDetail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none cursor-pointer"
              >
                {journey === 'pregnant' ? (
                  <>
                    <option value="Trimester 1 (Weeks 1–13)">Trimester 1 (Weeks 1–13)</option>
                    <option value="Trimester 2 (Weeks 14–27)">Trimester 2 (Weeks 14–27)</option>
                    <option value="Trimester 3 (Weeks 28–40+)">Trimester 3 (Weeks 28–40+)</option>
                  </>
                ) : (
                  <>
                    <option value="First 2 Weeks (Immediate Recovery)">First 2 Weeks (Immediate Recovery)</option>
                    <option value="Weeks 3–6 (Early Postpartum)">Weeks 3–6 (Early Postpartum)</option>
                    <option value="Month 2–6 (Infant Care & Recovery)">Month 2–6 (Infant Care &amp; Recovery)</option>
                    <option value="6+ Months (Beyond Fourth Trimester)">6+ Months (Beyond Fourth Trimester)</option>
                  </>
                )}
              </select>
            </div>

            {/* Privacy Promise */}
            <div className="flex items-center gap-2 text-xs text-[#705B51] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#A8BCA1]" />
              <span>Zero advertisements • Health data stays strictly on your device</span>
            </div>

            {/* CTA Submit Button */}
            <button
              type="submit"
              className={`w-full py-3.5 px-6 rounded-full font-semibold text-white text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                journey === 'pregnant'
                  ? 'bg-[#D98F96] hover:bg-[#C67981] shadow-[#D98F96]/30'
                  : 'bg-[#5F7C58] hover:bg-[#4E6847] shadow-[#5F7C58]/30'
              }`}
            >
              <span>Explore My Care Space</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        ) : (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#EEF4EC] text-[#5F7C58] flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#45362F]">
              Welcome, {name.trim() || 'Sakhi'}! ♡
            </h4>
            <p className="text-sm text-[#705B51] max-w-xs mx-auto">
              Setting up your {journey === 'pregnant' ? 'pregnancy companion' : 'postnatal & newborn suite'}...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
