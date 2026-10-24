import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JourneySelector from './components/JourneySelector';
import PregnancySection from './components/PregnancySection';
import PostnatalSection from './components/PostnatalSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import GetStartedModal from './components/GetStartedModal';
import MedicationTracker from './components/MedicationTracker';
import SymptomTracker from './components/SymptomTracker';

export default function App() {
  const isMedicationTrackerPage = window.location.pathname === '/medication-tracker';
  const isSymptomTrackerPage = window.location.pathname === '/symptom-tracker';
  const isTrackerPage = isMedicationTrackerPage || isSymptomTrackerPage;
  const requestedJourney = new URLSearchParams(window.location.search).get('journey');
  const initialJourney = requestedJourney === 'pregnant' || requestedJourney === 'postnatal'
    ? requestedJourney
    : null;
  const [selectedJourney, setSelectedJourney] = useState(
    initialJourney === 'pregnant' || initialJourney === 'postnatal' ? initialJourney : null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialJourney, setModalInitialJourney] = useState('pregnant');

  useEffect(() => {
    if (isTrackerPage || !window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    target?.scrollIntoView({ behavior: 'smooth' });
  }, [isTrackerPage, selectedJourney]);

  const handleSelectJourney = (journey) => {
    setSelectedJourney(journey);
  };

  const handleOpenGetStarted = (presetJourney = 'pregnant') => {
    setModalInitialJourney(presetJourney || selectedJourney || 'pregnant');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#45362F] flex flex-col selection:bg-[#F4B49B]/30 selection:text-[#45362F]">

      {/* 2. Responsive Navbar */}
      <Navbar
        onSelectJourney={handleSelectJourney}
        onOpenGetStarted={() => handleOpenGetStarted()}
        isTrackerPage={isTrackerPage}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isTrackerPage ? (
          <section className="relative overflow-hidden border-b border-[#EADFCF] bg-gradient-to-b from-[#F7F1E8] via-[#F4F8F3] to-[#F7F1E8] py-12 sm:py-16 md:py-20">
            <div className="pointer-events-none absolute -right-20 top-16 h-80 w-80 rounded-full bg-[#A8BCA1]/15 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -left-20 bottom-8 h-72 w-72 rounded-full bg-[#F4B49B]/15 blur-3xl" aria-hidden="true" />
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="space-y-5 text-center lg:col-span-6 lg:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D98F96]">
                    {isMedicationTrackerPage
                      ? 'A little more support, every day'
                      : `${initialJourney === 'postnatal' ? 'Postpartum' : 'Pregnancy'} care`}
                  </p>
                  <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[#45362F] sm:text-5xl">
                    {isMedicationTrackerPage
                      ? <>Keep your care <span className="text-[#D98F96]">close at hand.</span></>
                      : <>Make space to notice <span className="text-[#D98F96]">how you feel.</span></>}
                  </h1>
                  <p className="mx-auto max-w-xl text-base leading-relaxed text-[#705B51] sm:text-lg lg:mx-0">
                    {isMedicationTrackerPage
                      ? 'Keep your medication details and dose notes together in one calm, easy-to-use place.'
                      : 'A gentle place to record symptoms, notice changes over time, and prepare for conversations with your care team.'}
                  </p>
                </div>

                <div className="relative mx-auto w-full max-w-md lg:col-span-6">
                  <div className="absolute inset-0 scale-[1.03] rotate-2 rounded-[2.5rem] bg-gradient-to-tr from-[#F4B49B]/35 via-[#FFF9F1] to-[#D98F96]/25 blur-xs" aria-hidden="true" />
                  <div className="group relative overflow-hidden rounded-[2rem] border-4 border-[#FFF9F1] shadow-2xl shadow-[#45362F]/10">
                    <img
                      src={isMedicationTrackerPage
                        ? '/images/medication-tracker.svg'
                        : '/images/symptom-tracker.svg'}
                      alt={isMedicationTrackerPage
                        ? 'Illustration of a medication bottle, dose reminders, and a daily organizer'
                        : 'Illustration of a symptom journal with a wellbeing and heart chart'}
                      className="aspect-[4/3] w-full object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#45362F]/20 to-transparent" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {isMedicationTrackerPage ? (
                <MedicationTracker />
              ) : (
                <SymptomTracker initialJourney={initialJourney} />
              )}
            </div>
          </section>
        ) : (
          <>

        {/* 3. Hero Section */}
        <Hero
          onChooseJourneyClick={() => {
            const el = document.getElementById('journey-selection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Main Interactive Section: Choose Your Journey */}
        <JourneySelector
          selectedJourney={selectedJourney}
          onSelectJourney={handleSelectJourney}
        />

        {/* 5. Pregnancy Care Section (Visible ONLY when 'pregnant' is selected) */}
        {selectedJourney === 'pregnant' && (
          <div className="animate-fadeIn">
            <PregnancySection
              onSwitchToPostnatal={() => {
                handleSelectJourney('postnatal');
                setTimeout(() => {
                  const el = document.getElementById('postnatal-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 70);
              }}
            />
          </div>
        )}

        {/* 6. Postnatal Care Section (Visible ONLY when 'postnatal' is selected) */}
        {selectedJourney === 'postnatal' && (
          <div className="animate-fadeIn">
            <PostnatalSection
              onSwitchToPregnancy={() => {
                handleSelectJourney('pregnant');
                setTimeout(() => {
                  const el = document.getElementById('pregnancy-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 70);
              }}
            />
          </div>
        )}



        {/* About Us Pillar Section */}
        <AboutSection />
          </>
        )}

      </main>

      {/* 9. Footer */}
      <Footer
        isTrackerPage={isTrackerPage}
        onSelectJourney={(journey) => {
          handleSelectJourney(journey);
        }}
      />

      {/* Interactive Get Started Onboarding Modal */}
      <GetStartedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialJourney={modalInitialJourney}
        onCompleteJourney={(journey) => {
          setSelectedJourney(journey);
        }}
      />

    </div>
  );
}
