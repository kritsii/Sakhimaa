import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, Clock } from 'lucide-react';
import { 
  createDynamicDueDate, 
  createDynamicDeliveryDate,
  calculatePregnancyProgress,
  calculatePostnatalProgress
} from '../../utils/dateCalculations';

export default function DateSettingsModal({
  isOpen,
  onClose,
  currentUser,
  onSaveDate,
}) {
  const isPregnant = currentUser?.journey !== 'postnatal';

  const [dateInput, setDateInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isPregnant) {
        setDateInput(currentUser?.dueDate || '');
      } else {
        setDateInput(currentUser?.deliveryDate || '');
      }
      setFeedbackMsg('');
    }
  }, [isOpen, isPregnant, currentUser]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!dateInput) {
      setFeedbackMsg('Please select a valid date.');
      return;
    }

    if (isPregnant) {
      onSaveDate({ dueDate: dateInput });
    } else {
      onSaveDate({ deliveryDate: dateInput });
    }
    onClose();
  };

  // Quick preset helpers
  const applyPresetWeeks = (weeks) => {
    if (isPregnant) {
      const newDate = createDynamicDueDate(weeks);
      setDateInput(newDate);
    } else {
      const newDate = createDynamicDeliveryDate(weeks);
      setDateInput(newDate);
    }
  };

  // Preview calculation
  const previewPregnancy = isPregnant && dateInput ? calculatePregnancyProgress(dateInput) : null;
  const previewPostnatal = !isPregnant && dateInput ? calculatePostnatalProgress(dateInput) : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#45362F]/40 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="date-modal-title"
    >
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[#FFF9F1] border border-[#EADFCF] p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#705B51] hover:bg-[#F7F1E8] hover:text-[#45362F] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF4EC] border border-[#559C91]/30 flex items-center justify-center text-[#559C91] mx-auto shadow-xs">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 id="date-modal-title" className="font-serif text-2xl font-bold text-[#45362F]">
            {isPregnant ? 'Set Your Due Date' : "Set Baby's Delivery Date"}
          </h2>
          <p className="text-xs sm:text-sm text-[#705B51] max-w-xs mx-auto">
            {isPregnant 
              ? 'We use your estimated due date to calculate your dynamic pregnancy week and guidance.'
              : 'We use your baby’s birth date to calculate your postpartum recovery weeks.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="stage-date-input" className="block text-xs font-bold text-[#45362F] uppercase tracking-wider">
              {isPregnant ? 'Estimated Due Date (EDD)' : 'Actual Delivery Date'}
            </label>
            <input
              id="stage-date-input"
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADFCF] text-[#45362F] font-medium focus:outline-none focus:ring-2 focus:ring-[#559C91] shadow-2xs"
              required
            />
          </div>

          {/* Dynamic Preview Pill */}
          {isPregnant && previewPregnancy?.isValid && (
            <div className="p-3 rounded-2xl bg-[#EEF4EC] border border-[#559C91]/30 text-xs text-[#559C91] font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Calculates to: <strong>{previewPregnancy.weeks} Weeks</strong> (Month {previewPregnancy.month} • {previewPregnancy.trimester})</span>
            </div>
          )}

          {!isPregnant && previewPostnatal?.isValid && (
            <div className="p-3 rounded-2xl bg-[#FCECE5] border border-[#F08070]/30 text-xs text-[#F08070] font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Calculates to: <strong>{previewPostnatal.durationText}</strong></span>
            </div>
          )}

          {feedbackMsg && (
            <p className="text-xs text-[#F08070] font-medium">{feedbackMsg}</p>
          )}

          {/* Quick Demo Presets */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-semibold text-[#705B51] uppercase tracking-wider block">
              Quick Presets (For Demonstration):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {isPregnant ? (
                <>
                  <button
                    type="button"
                    onClick={() => applyPresetWeeks(24)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EADFCF] hover:border-[#559C91] text-[#45362F] cursor-pointer shadow-2xs"
                  >
                    24 Weeks (Default Example)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetWeeks(12)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EADFCF] hover:border-[#559C91] text-[#45362F] cursor-pointer shadow-2xs"
                  >
                    12 Weeks (1st Trimester)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetWeeks(34)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EADFCF] hover:border-[#559C91] text-[#45362F] cursor-pointer shadow-2xs"
                  >
                    34 Weeks (3rd Trimester)
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => applyPresetWeeks(3)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EADFCF] hover:border-[#F08070] text-[#45362F] cursor-pointer shadow-2xs"
                  >
                    3 Weeks Postnatal (Default Example)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetWeeks(1)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EADFCF] hover:border-[#F08070] text-[#45362F] cursor-pointer shadow-2xs"
                  >
                    1 Week Postpartum
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetWeeks(8)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#EADFCF] hover:border-[#F08070] text-[#45362F] cursor-pointer shadow-2xs"
                  >
                    8 Weeks Postpartum
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#705B51] hover:bg-[#F7F1E8] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#559C91] hover:bg-[#437F76] shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Update Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
