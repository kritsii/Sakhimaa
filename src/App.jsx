import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JourneySelector from './components/JourneySelector';
import PregnancySection from './components/PregnancySection';
import PostnatalSection from './components/PostnatalSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import GetStartedModal from './components/GetStartedModal';
import Dashboard from './components/Dashboard';
import { Check } from 'lucide-react';
import { logout as apiLogout } from './api/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing' | 'dashboard'
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialJourney, setModalInitialJourney] = useState('pregnant');
  const [toastMessage, setToastMessage] = useState(null);

  // Authenticated user state with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhimaa_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSelectJourney = (journey) => {
    setSelectedJourney(journey);
  };

  const handleOpenGetStarted = (presetJourney = 'pregnant') => {
    setModalInitialJourney(presetJourney || selectedJourney || 'pregnant');
    setIsModalOpen(true);
  };

  const handleAuthSuccess = (user, journeyStage) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sakhimaa_current_user', JSON.stringify(user));
    } catch (e) {
      console.error('Storage error', e);
    }

    if (journeyStage) {
      setSelectedJourney(journeyStage);
    }

    // Immediately route to the dashboard page after signin or signup
    setCurrentPage('dashboard');
    showToast(`Welcome, ${user.name || 'Sakhi'}! ♡`);
  };

  const handleLogout = () => {
    apiLogout();
    setCurrentUser(null);
    try {
      localStorage.removeItem('sakhimaa_current_user');
    } catch (e) {
      console.error('Storage error', e);
    }
    setCurrentPage('landing');
    showToast('Signed out safely. Take gentle care of yourself!');
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    if (updatedUser?.journey) {
      setSelectedJourney(updatedUser.journey);
    }
  };

  // If on Dashboard page, render the dashboard page
  if (currentPage === 'dashboard') {
    return (
      <div className="relative">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
            <div className="bg-[#FFF9F1] border-2 border-[#EADFCF] rounded-2xl shadow-xl px-5 py-3.5 flex items-center gap-3 text-sm font-semibold text-[#45362F]">
              <div className="w-8 h-8 rounded-full bg-[#EEF4EC] text-[#5F7C58] flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <Dashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          onGoToHome={() => setCurrentPage('landing')}
          onUpdateUser={handleUpdateUser}
        />
      </div>
    );
  }

  // Otherwise, render Landing Page
  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#45362F] flex flex-col selection:bg-[#F4B49B]/30 selection:text-[#45362F] relative">

      {/* Floating Welcome Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-[#FFF9F1] border-2 border-[#EADFCF] rounded-2xl shadow-xl px-5 py-3.5 flex items-center gap-3 text-sm font-semibold text-[#45362F]">
            <div className="w-8 h-8 rounded-full bg-[#EEF4EC] text-[#5F7C58] flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 2. Responsive Navbar */}
      <Navbar
        onSelectJourney={handleSelectJourney}
        onOpenGetStarted={() => handleOpenGetStarted()}
        currentUser={currentUser}
        onLogout={handleLogout}
        onGoToDashboard={() => setCurrentPage('dashboard')}
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

      {/* Authentication & Onboarding Modal (SignUp & Login) */}
      <GetStartedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialJourney={modalInitialJourney}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
