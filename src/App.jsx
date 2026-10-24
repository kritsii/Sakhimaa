import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JourneySelector from './components/JourneySelector';
import PregnancySection from './components/PregnancySection';
import PostnatalSection from './components/PostnatalSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import GetStartedModal from './components/GetStartedModal';

export default function App() {
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialJourney, setModalInitialJourney] = useState('pregnant');

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
      />

      {/* Main Content Area */}
      <main className="flex-1">

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

      </main>

      {/* 9. Footer */}
      <Footer
        onSelectJourney={handleSelectJourney}
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
