import React, { useState, useEffect, useCallback } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import DashboardHeader from './dashboard/DashboardHeader';
import PersonalizedWelcome from './dashboard/PersonalizedWelcome';
import MomentForYou from './dashboard/MomentForYou';
import HealthcareFeaturesGrid from './dashboard/HealthcareFeaturesGrid';
import FeaturePlaceholderView from './dashboard/FeaturePlaceholderView';
import DateSettingsModal from './dashboard/DateSettingsModal';
import SymptomTracker from './SymptomTracker';
import MedicationTracker from './MedicationTracker';
import YogaGuide from './YogaGuide';
import BreastfeedingSupport from './BreastfeedingSupport';
import NewbornCare from './NewbornCare';
import AppointmentPlanner from './AppointmentPlanner';
import PregnancyWeekGuide from './PregnancyWeekGuide';
import MedicalReportAnalysis from './MedicalReportAnalysis';
import { updateUserProfileStorage } from '../utils/dashboardStorage';
import {
  createDynamicDueDate,
  createDynamicDeliveryDate
} from '../utils/dateCalculations';
import {
  DASHBOARD_ROUTES,
  PREGNANCY_FEATURE_CARDS,
  POSTNATAL_FEATURE_CARDS,
} from '../constants/routes';

export default function Dashboard({
  currentUser,
  onLogout,
  onGoToHome,
  onUpdateUser
}) {
  // Resolve any initial feature directly from current URL so refresh stays on active feature
  const getInitialFeature = () => {
    if (typeof window === 'undefined') return null;
    const path = window.location.pathname;
    const allCards = [...PREGNANCY_FEATURE_CARDS, ...POSTNATAL_FEATURE_CARDS];
    return allCards.find((c) => c.path === path) || null;
  };

  const initialFeature = getInitialFeature();
  // Navigation view: 'dashboard' | 'feature'
  const [currentView, setCurrentView] = useState(initialFeature ? 'feature' : 'dashboard');
  const [selectedFeature, setSelectedFeature] = useState(initialFeature);

  // Date modal state
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Ensure default demo dates are initialized if completely missing from saved profile
  useEffect(() => {
    if (currentUser && !currentUser.dueDate && !currentUser.deliveryDate) {
      if (currentUser.journey === 'postnatal') {
        const defaultDeliv = createDynamicDeliveryDate(3);
        const updated = updateUserProfileStorage({ deliveryDate: defaultDeliv });
        if (updated && onUpdateUser) onUpdateUser(updated);
      } else {
        const defaultDue = createDynamicDueDate(24);
        const updated = updateUserProfileStorage({ dueDate: defaultDue });
        if (updated && onUpdateUser) onUpdateUser(updated);
      }
    }
  }, [currentUser, onUpdateUser]);

  // Date updates from modal
  const handleSaveDate = (dateData) => {
    const updated = updateUserProfileStorage(dateData);
    if (updated && onUpdateUser) {
      onUpdateUser(updated);
    }
    showToast('Your stage dates have been updated successfully! ♡');
  };

  // Support direct URL navigation or browser back/forward history
  useEffect(() => {
    const handleUrlSync = () => {
      const path = window.location.pathname;
      const allCards = [...PREGNANCY_FEATURE_CARDS, ...POSTNATAL_FEATURE_CARDS];
      const matched = allCards.find((c) => c.path === path);
      if (matched) {
        setSelectedFeature(matched);
        setCurrentView('feature');
      } else if (path === DASHBOARD_ROUTES.DASHBOARD_OVERVIEW || path === '/dashboard') {
        setSelectedFeature(null);
        setCurrentView('dashboard');
      }
    };

    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  // Feature navigation
  const handleNavigateToFeature = (featureCard) => {
    setSelectedFeature(featureCard);
    setCurrentView('feature');
    if (featureCard?.path && window.location.pathname !== featureCard.path) {
      window.history.pushState({}, '', featureCard.path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedFeature(null);
    if (window.location.pathname !== DASHBOARD_ROUTES.DASHBOARD_OVERVIEW) {
      window.history.pushState({}, '', DASHBOARD_ROUTES.DASHBOARD_OVERVIEW);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSymptomTracker =
    selectedFeature?.routeConstant === 'PREGNANCY_SYMPTOMS' ||
    selectedFeature?.routeConstant === 'POSTNATAL_RECOVERY';

  const isMedicationTracker =
    selectedFeature?.routeConstant === 'PREGNANCY_MEDICATIONS' ||
    selectedFeature?.routeConstant === 'POSTNATAL_MEDICATIONS';

  const isYogaGuide = selectedFeature?.routeConstant === 'YOGA_GUIDE';
  const isBreastfeedingSupport = selectedFeature?.routeConstant === 'BREASTFEEDING';
  const isNewbornCare = selectedFeature?.routeConstant === 'NEWBORN_CARE';
  const isAntenatalAppointments = selectedFeature?.routeConstant === 'PREGNANCY_APPOINTMENTS';
  const isPregnancyGuide = selectedFeature?.routeConstant === 'PREGNANCY_GUIDE';
  const isReportAnalysis =
    selectedFeature?.routeConstant === 'PREGNANCY_REPORTS' ||
    selectedFeature?.routeConstant === 'POSTNATAL_REPORTS';

  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#45362F] flex flex-col selection:bg-[#F08070]/30 selection:text-[#45362F] relative font-sans">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-[#FFF9F1] border-2 border-[#EADFCF] rounded-2xl shadow-xl px-5 py-3.5 flex items-center gap-3 text-sm font-semibold text-[#45362F]">
            <div className="w-8 h-8 rounded-full bg-[#EEF4EC] text-[#559C91] flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header with Logo, Navigation, & User profile */}
      <DashboardHeader
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'dashboard') {
            handleBackToDashboard();
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onLogout={onLogout}
        onGoToHome={onGoToHome}
        onOpenDateModal={() => setIsDateModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* VIEW 1: Main Dashboard Overview (3 Sections in exact required order) */}
        {currentView === 'dashboard' && (
          <div className="space-y-10 sm:space-y-12 animate-fadeIn">

            {/* Section 1: Personalised welcome section */}
            <PersonalizedWelcome
              currentUser={currentUser}
              onOpenDateModal={() => setIsDateModalOpen(true)}
            />

            {/* Section 2: “A Little Moment for You” — positive thoughts, reflections */}
            <MomentForYou
              currentUser={currentUser}
            />

            {/* Section 3: Main healthcare feature cards navigating to separate feature pages */}
            <HealthcareFeaturesGrid
              currentUser={currentUser}
              onNavigateToFeature={handleNavigateToFeature}
            />

          </div>
        )}

        {/* VIEW 2: Dedicated Feature Views */}
        {currentView === 'feature' && (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -my-8 sm:-my-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[calc(100vh-5rem)] flex flex-col justify-start animate-fadeIn">
            {/* Botanical watercolor background behind every feature page */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
              style={{ backgroundImage: `url('/images/symptom-bg.png')` }}
              aria-hidden="true"
            />

            {/* Feature View Content sitting cleanly on top of the background */}
            <div className="relative z-10 w-full">
              {isSymptomTracker ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  <SymptomTracker
                    initialJourney={
                      selectedFeature?.routeConstant === 'POSTNATAL_RECOVERY'
                        ? 'postnatal'
                        : 'pregnant'
                    }
                  />
                </div>
              ) : isMedicationTracker ? (
                <div className="max-w-4xl mx-auto space-y-6">
                  <MedicationTracker />
                </div>
              ) : isYogaGuide ? (
                <YogaGuide
                  journey={currentUser?.journey === 'postnatal' ? 'postnatal' : 'pregnant'}
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : isBreastfeedingSupport ? (
                <BreastfeedingSupport
                  userId={currentUser?.id}
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : isNewbornCare ? (
                <NewbornCare
                  userId={currentUser?.id}
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : isAntenatalAppointments ? (
                <AppointmentPlanner
                  userId={currentUser?.id}
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : isPregnancyGuide ? (
                <PregnancyWeekGuide
                  dueDate={currentUser?.dueDate}
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : isReportAnalysis ? (
                <MedicalReportAnalysis
                  currentUser={currentUser}
                  journey={
                    selectedFeature?.routeConstant === 'POSTNATAL_REPORTS'
                      ? 'postnatal'
                      : 'pregnant'
                  }
                  onBackToDashboard={handleBackToDashboard}
                />
              ) : (
                <FeaturePlaceholderView
                  feature={selectedFeature}
                  onBackToDashboard={handleBackToDashboard}
                />
              )}
            </div>
          </div>
        )}

      </main>

      {/* Footer in Dashboard */}
      <footer className="mt-auto border-t border-[#EADFCF] bg-[#FFF9F1]/80 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#705B51] space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#45362F] text-sm">SakhiMaa</span>
            <span>•</span>
            <span>Care for her. Care for them.</span>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed">
            SakhiMaa provides supportive wellness tracking and compassionate reminders. It does not replace professional medical diagnosis, advice, or emergency care.
          </p>
          <p>© {new Date().getFullYear()} SakhiMaa Healthcare Companion</p>
        </div>
      </footer>

      {/* Date Settings Modal */}
      <DateSettingsModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        currentUser={currentUser}
        onSaveDate={handleSaveDate}
      />

    </div>
  );
}
