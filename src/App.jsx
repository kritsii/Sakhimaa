
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JourneySelector from './components/JourneySelector';
import PregnancySection from './components/PregnancySection';
import PostnatalSection from './components/PostnatalSection';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import GetStartedModal from './components/GetStartedModal';
import Dashboard from './components/Dashboard';
import MedicationTracker from './components/MedicationTracker';
import SymptomTracker from './components/SymptomTracker';
import { Check } from 'lucide-react';
import { logout as apiLogout } from './api/auth';

export default function App() {
  const isMedicationTrackerPage =
    window.location.pathname === '/medication-tracker';

  const isSymptomTrackerPage =
    window.location.pathname === '/symptom-tracker';

  const isTrackerPage =
    isMedicationTrackerPage || isSymptomTrackerPage;

  const requestedJourney = new URLSearchParams(
    window.location.search
  ).get('journey');

  const initialJourney =
    requestedJourney === 'pregnant' ||
      requestedJourney === 'postnatal'
      ? requestedJourney
      : null;

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sakhimaa_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isDashboardRoute = (path) => {
    if (!path) return false;
    if (path === '/dashboard' || path.startsWith('/dashboard/')) return true;
    if (path.startsWith('/pregnancy/')) return true;
    if (path.startsWith('/postnatal/')) return true;
    if (path.startsWith('/wellness/')) return true;
    if (path === '/health-reports') return true;
    return false;
  };

  const [currentPage, setCurrentPage] = useState(() => {
    if (isMedicationTrackerPage || isSymptomTrackerPage) {
      return 'landing';
    }

    if (typeof window !== 'undefined') {
      if (isDashboardRoute(window.location.pathname)) {
        return 'dashboard';
      }
      try {
        const storedPage = localStorage.getItem('sakhimaa_current_page');
        if (storedPage === 'dashboard') {
          return 'dashboard';
        }
      } catch (e) {
        console.error('Storage error', e);
      }
    }
    return 'landing';
  });

  const [selectedJourney, setSelectedJourney] = useState(
    initialJourney || currentUser?.journey || 'pregnant'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialJourney, setModalInitialJourney] =
    useState('pregnant');

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync currentPage to localStorage and ensure proper URL synchronization
  useEffect(() => {
    try {
      localStorage.setItem('sakhimaa_current_page', currentPage);
    } catch (error) {
      console.error('Storage error', error);
    }

    if (currentPage === 'dashboard') {
      if (window.location.pathname === '/' || window.location.pathname === '') {
        window.history.replaceState({}, '', '/dashboard');
      }
    } else if (currentPage === 'landing') {
      if (isDashboardRoute(window.location.pathname)) {
        window.history.replaceState({}, '', '/');
      }
    }
  }, [currentPage]);

  // Sync browser back/forward buttons with currentPage
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (isDashboardRoute(path)) {
        setCurrentPage('dashboard');
      } else if (path === '/' || path === '') {
        setCurrentPage('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isTrackerPage || !window.location.hash) return;

    const target = document.getElementById(
      window.location.hash.slice(1)
    );

    target?.scrollIntoView({ behavior: 'smooth' });
  }, [isTrackerPage, selectedJourney]);

  const handleSelectJourney = (journey) => {
    setSelectedJourney(journey);
  };

  const handleOpenGetStarted = (presetJourney = 'pregnant') => {
    setModalInitialJourney(
      presetJourney || selectedJourney || 'pregnant'
    );
    setIsModalOpen(true);
  };

  const handleGoToDashboard = () => {
    try {
      localStorage.setItem('sakhimaa_current_page', 'dashboard');
    } catch (error) {
      console.error('Storage error', error);
    }
    if (window.location.pathname === '/' || !isDashboardRoute(window.location.pathname)) {
      window.history.pushState({}, '', '/dashboard');
    }
    setCurrentPage('dashboard');
  };

  const handleGoToHome = () => {
    try {
      localStorage.setItem('sakhimaa_current_page', 'landing');
    } catch (error) {
      console.error('Storage error', error);
    }
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setCurrentPage('landing');
  };

  const handleAuthSuccess = (user, journeyStage) => {
    setCurrentUser(user);

    try {
      localStorage.setItem(
        'sakhimaa_current_user',
        JSON.stringify(user)
      );
      localStorage.setItem('sakhimaa_current_page', 'dashboard');
    } catch (error) {
      console.error('Storage error', error);
    }

    if (journeyStage) {
      setSelectedJourney(journeyStage);
    }

    if (window.location.pathname === '/' || !isDashboardRoute(window.location.pathname)) {
      window.history.pushState({}, '', '/dashboard');
    }

    setCurrentPage('dashboard');
    showToast(`Welcome, ${user.name || 'Sakhi'}! ♡`);
  };

  const handleLogout = () => {
    apiLogout();
    setCurrentUser(null);

    try {
      localStorage.removeItem('sakhimaa_current_user');
      localStorage.setItem('sakhimaa_current_page', 'landing');
    } catch (error) {
      console.error('Storage error', error);
    }

    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
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

  // Dashboard
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
          onGoToHome={handleGoToHome}
          onUpdateUser={handleUpdateUser}
        />
      </div>
    );
  }

  // Landing page and tracker pages
  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#45362F] flex flex-col selection:bg-[#F4B49B]/30 selection:text-[#45362F] relative">
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

      <Navbar
        onSelectJourney={handleSelectJourney}
        onOpenGetStarted={() => handleOpenGetStarted()}
        currentUser={currentUser}
        onLogout={handleLogout}
        onGoToDashboard={handleGoToDashboard}
        isTrackerPage={isTrackerPage}
      />

      <main className="flex-1">
        {isTrackerPage ? (
          <section className="relative overflow-hidden border-b border-[#EADFCF] bg-gradient-to-b from-[#F7F1E8] via-[#F4F8F3] to-[#F7F1E8] py-12 sm:py-16 md:py-20">
            <div
              className="pointer-events-none absolute -right-20 top-16 h-80 w-80 rounded-full bg-[#A8BCA1]/15 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -left-20 bottom-8 h-72 w-72 rounded-full bg-[#F4B49B]/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="space-y-5 text-center lg:col-span-6 lg:text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D98F96]">
                    {isMedicationTrackerPage
                      ? 'A little more support, every day'
                      : `${initialJourney === 'postnatal' ? 'Postpartum' : 'Pregnancy'} care`}
                  </p>

                  <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[#45362F] sm:text-5xl">
                    {isMedicationTrackerPage ? (
                      <>
                        Keep your care{' '}
                        <span className="text-[#D98F96]">
                          close at hand.
                        </span>
                      </>
                    ) : (
                      <>
                        Make space to notice{' '}
                        <span className="text-[#D98F96]">
                          how you feel.
                        </span>
                      </>
                    )}
                  </h1>

                  <p className="mx-auto max-w-xl text-base leading-relaxed text-[#705B51] sm:text-lg lg:mx-0">
                    {isMedicationTrackerPage
                      ? 'Keep your medication details and dose notes together in one calm, easy-to-use place.'
                      : 'A gentle place to record symptoms, notice changes over time, and prepare for conversations with your care team.'}
                  </p>
                </div>

                <div className="relative mx-auto w-full max-w-md lg:col-span-6">
                  <div
                    className="absolute inset-0 scale-[1.03] rotate-2 rounded-[2.5rem] bg-gradient-to-tr from-[#F4B49B]/35 via-[#FFF9F1] to-[#D98F96]/25 blur-xs"
                    aria-hidden="true"
                  />

                  <div className="group relative overflow-hidden rounded-[2rem] border-4 border-[#FFF9F1] shadow-2xl shadow-[#45362F]/10">
                    <img
                      src={
                        isMedicationTrackerPage
                          ? '/images/medication-tracker.svg'
                          : '/images/symptom-tracker.svg'
                      }
                      alt={
                        isMedicationTrackerPage
                          ? 'Medication organizer illustration'
                          : 'Symptom journal illustration'
                      }
                      className="aspect-[4/3] w-full object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#45362F]/20 to-transparent"
                      aria-hidden="true"
                    />
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
            <Hero
              onChooseJourneyClick={() => {
                const element = document.getElementById(
                  'journey-selection'
                );

                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <JourneySelector
              selectedJourney={selectedJourney}
              onSelectJourney={handleSelectJourney}
              onOpenGetStarted={handleOpenGetStarted}
            />

            {selectedJourney === 'pregnant' && (
              <div className="animate-fadeIn">
                <PregnancySection
                  onSwitchToPostnatal={() => {
                    handleSelectJourney('postnatal');

                    setTimeout(() => {
                      document
                        .getElementById('postnatal-section')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }, 70);
                  }}
                />
              </div>
            )}

            {selectedJourney === 'postnatal' && (
              <div className="animate-fadeIn">
                <PostnatalSection
                  onSwitchToPregnancy={() => {
                    handleSelectJourney('pregnant');

                    setTimeout(() => {
                      document
                        .getElementById('pregnancy-section')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }, 70);
                  }}
                />
              </div>
            )}

            <AboutSection />
          </>
        )}
      </main>

      {!isTrackerPage && (
        <Footer onSelectJourney={handleSelectJourney} />
      )}

      <GetStartedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialJourney={modalInitialJourney}
        onAuthSuccess={handleAuthSuccess}
        onCompleteJourney={(journey) => {
          setSelectedJourney(journey);
        }}
      />
    </div>
  );
}
