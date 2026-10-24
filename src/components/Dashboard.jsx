import React, { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import DashboardHeader from './dashboard/DashboardHeader';
import PersonalizedWelcome from './dashboard/PersonalizedWelcome';
import MomentForYou from './dashboard/MomentForYou';
import HealthcareFeaturesGrid from './dashboard/HealthcareFeaturesGrid';
import FeaturePlaceholderView from './dashboard/FeaturePlaceholderView';
import DateSettingsModal from './dashboard/DateSettingsModal';
import { updateUserProfileStorage } from '../utils/dashboardStorage';
import { 
  createDynamicDueDate, 
  createDynamicDeliveryDate 
} from '../utils/dateCalculations';

export default function Dashboard({ 
  currentUser, 
  onLogout, 
  onGoToHome,
  onUpdateUser 
}) {
  // Navigation view: 'dashboard' | 'feature'
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedFeature, setSelectedFeature] = useState(null);
  
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

  // Feature navigation
  const handleNavigateToFeature = (featureCard) => {
    setSelectedFeature(featureCard);
    setCurrentView('feature');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedFeature(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* VIEW 2: Dedicated Feature Integration Placeholder View */}
        {currentView === 'feature' && (
          <FeaturePlaceholderView
            feature={selectedFeature}
            onBackToDashboard={handleBackToDashboard}
          />
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
