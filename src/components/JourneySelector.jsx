import { ArrowRight, CheckCircle2, Baby, HeartPulse, Sparkles } from 'lucide-react';

export default function JourneySelector({ selectedJourney, onSelectJourney, onOpenGetStarted }) {
  const handleSelect = (journey) => {
    onSelectJourney(journey);
    const targetId = journey === 'pregnant' ? 'pregnancy-section' : 'postnatal-section';
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 70);
  };

  const handleKeyDown = (e, journey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(journey);
    }
  };

  return (
    <section id="journey-selection" className="py-20 md:py-28 bg-[#FFF9F1] relative overflow-hidden border-y border-[#EADFCF]/60">
      {/* Subtle organic decorations */}
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-[#F4B49B]/10 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#A8BCA1]/10 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#45362F] tracking-tight">
            Where are you in your motherhood journey?
          </h2>

          <p className="text-base sm:text-lg text-[#705B51] leading-relaxed">
            Choose your stage to discover care and support designed around you.
          </p>
        </div>

        {/* The Two Primary Journey Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">

          {/* Card A: I'm Pregnant */}
          <div
            id="card-pregnant-journey"
            role="button"
            tabIndex={0}
            onClick={() => handleSelect('pregnant')}
            onKeyDown={(e) => handleKeyDown(e, 'pregnant')}
            aria-pressed={selectedJourney === 'pregnant'}
            aria-label="Select I'm Pregnant journey"
            className={`group relative text-left rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#F4B49B]/50 ${
              selectedJourney === 'pregnant'
                ? 'bg-gradient-to-b from-[#FFF9F1] to-[#FCECE5]/90 border-2 border-[#D98F96] shadow-xl shadow-[#F4B49B]/25 scale-[1.01]'
                : 'bg-[#FFF9F1] border-2 border-[#EADFCF] hover:border-[#F4B49B] shadow-md hover:shadow-xl hover:shadow-[#F4B49B]/20 hover:-translate-y-1'
            }`}
          >
            {/* Active Pill Badge */}
            {selectedJourney === 'pregnant' && (
              <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D98F96] text-white text-xs font-semibold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Selected Journey</span>
              </div>
            )}

            {/* Top Visual Artwork */}
            <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[#FCECE5] to-[#F4B49B]/20 border border-[#F4B49B]/30 h-72 sm:h-80 w-full flex items-center justify-center">
              <img
                src="/images/pregnant-journey.png"
                alt="Expectant Indian mother gently holding her baby bump"
                className="w-full h-full object-cover object-[center_20%] transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#45362F]/25 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 bg-[#FFF9F1]/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-medium text-[#45362F] flex items-center gap-1.5 border border-[#F4B49B]/40 shadow-xs">
                <HeartPulse className="w-3.5 h-3.5 text-[#D98F96]" />
              </div>
            </div>

            {/* Card Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#45362F] group-hover:text-[#D98F96] transition-colors">
                  I&apos;m Pregnant
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FCECE5] text-[#D98F96]">
                  Antenatal Care
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#705B51] leading-relaxed">
                Thoughtful guidance for your pregnancy, your changing body, and the little life growing within you.
              </p>

              {/* Three Short Highlights */}
              <div className="py-2 space-y-2.5 border-y border-[#EADFCF]/70">
                <div className="flex items-center gap-3 text-sm text-[#45362F]">
                  <div className="w-5 h-5 rounded-full bg-[#FCECE5] flex items-center justify-center shrink-0 text-[#D98F96]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Pregnancy symptom guidance</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#45362F]">
                  <div className="w-5 h-5 rounded-full bg-[#FCECE5] flex items-center justify-center shrink-0 text-[#D98F96]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Health tracking and insights</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#45362F]">
                  <div className="w-5 h-5 rounded-full bg-[#FCECE5] flex items-center justify-center shrink-0 text-[#D98F96]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Antenatal care reminders</span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2 space-y-2.5">
                <div 
                  className={`group/explore inline-flex items-center justify-between w-full px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-xs ${
                    selectedJourney === 'pregnant'
                      ? 'bg-[#D98F96] text-white'
                      : 'text-[#45362F] bg-[#FCECE5] hover:bg-[#D98F96] hover:text-white'
                  }`}
                >
                  <span>Explore Pregnancy Care</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/explore:translate-x-1 transition-transform" />
                </div>

                {onOpenGetStarted && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGetStarted('pregnant');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer text-[#45362F] bg-[#FCECE5] hover:bg-[#D98F96] hover:text-white"
                    aria-label="Get started with pregnancy care - sign in or create an account"
                  >
                    <Sparkles className="w-4 h-4 transition-colors" />
                    <span>Get Started</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Card B: I've Delivered */}
          <div
            id="card-postnatal-journey"
            role="button"
            tabIndex={0}
            onClick={() => handleSelect('postnatal')}
            onKeyDown={(e) => handleKeyDown(e, 'postnatal')}
            aria-pressed={selectedJourney === 'postnatal'}
            aria-label="Select I've Delivered journey"
            className={`group relative text-left rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#A8BCA1]/50 ${
              selectedJourney === 'postnatal'
                ? 'bg-gradient-to-b from-[#FFF9F1] to-[#EEF4EC]/90 border-2 border-[#A8BCA1] shadow-xl shadow-[#A8BCA1]/25 scale-[1.01]'
                : 'bg-[#FFF9F1] border-2 border-[#EADFCF] hover:border-[#A8BCA1] shadow-md hover:shadow-xl hover:shadow-[#A8BCA1]/20 hover:-translate-y-1'
            }`}
          >
            {/* Active Pill Badge */}
            {selectedJourney === 'postnatal' && (
              <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5F7C58] text-white text-xs font-semibold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Selected Journey</span>
              </div>
            )}

            {/* Top Visual Artwork */}
            <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-[#EEF4EC] to-[#C7B8DD]/20 border border-[#A8BCA1]/30 h-72 sm:h-80 w-full flex items-center justify-center">
              <img
                src="/images/postnatal-journey.png"
                alt="Loving Indian mother holding her newborn baby wrapped in a pink swaddle"
                className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#45362F]/25 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 bg-[#FFF9F1]/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-medium text-[#45362F] flex items-center gap-1.5 border border-[#A8BCA1]/40 shadow-xs">
                <Baby className="w-3.5 h-3.5 text-[#5F7C58]" />
              </div>
            </div>

            {/* Card Content */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#45362F] group-hover:text-[#5F7C58] transition-colors">
                  I&apos;ve Delivered
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EEF4EC] text-[#5F7C58]">
                  Postpartum & Infant
                </span>
              </div>

              <p className="text-sm sm:text-base text-[#705B51] leading-relaxed">
                Support for your recovery, your wellbeing, and caring for your newborn during those precious first weeks.
              </p>

              {/* Three Short Highlights */}
              <div className="py-2 space-y-2.5 border-y border-[#EADFCF]/70">
                <div className="flex items-center gap-3 text-sm text-[#45362F]">
                  <div className="w-5 h-5 rounded-full bg-[#EEF4EC] flex items-center justify-center shrink-0 text-[#5F7C58]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Mother&apos;s recovery tracking</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#45362F]">
                  <div className="w-5 h-5 rounded-full bg-[#EEF4EC] flex items-center justify-center shrink-0 text-[#5F7C58]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Breastfeeding support</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#45362F]">
                  <div className="w-5 h-5 rounded-full bg-[#EEF4EC] flex items-center justify-center shrink-0 text-[#5F7C58]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Newborn care</span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2 space-y-2.5">
                <div 
                  className={`group/explore inline-flex items-center justify-between w-full px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-xs ${
                    selectedJourney === 'postnatal'
                      ? 'bg-[#5F7C58] text-white'
                      : 'text-[#45362F] bg-[#EEF4EC] hover:bg-[#5F7C58] hover:text-white'
                  }`}
                >
                  <span>Explore Postnatal Care</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/explore:translate-x-1 transition-transform" />
                </div>

                {onOpenGetStarted && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenGetStarted('postnatal');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer text-[#45362F] bg-[#EEF4EC] hover:bg-[#5F7C58] hover:text-white"
                    aria-label="Get started with postnatal care - sign in or create an account"
                  >
                    <Sparkles className="w-4 h-4 transition-colors" />
                    <span>Get Started</span>
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
