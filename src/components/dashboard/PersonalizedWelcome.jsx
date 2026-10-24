import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  Baby, 
  Edit3,
  Clock
} from 'lucide-react';
import { 
  calculatePregnancyProgress, 
  calculatePostnatalProgress 
} from '../../utils/dateCalculations';

export default function PersonalizedWelcome({ 
  currentUser, 
  onOpenDateModal 
}) {
  const isPregnant = currentUser?.journey !== 'postnatal';
  const userName = currentUser?.name?.trim() || 'Sakhi';

  // Calculate dynamic progress from user's saved profile dates
  const pregnancyProgress = isPregnant 
    ? calculatePregnancyProgress(currentUser?.dueDate) 
    : null;

  const postnatalProgress = !isPregnant 
    ? calculatePostnatalProgress(currentUser?.deliveryDate) 
    : null;

  return (
    <section 
      aria-label="Personalized Welcome Section"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F1] via-[#FFFBF6] to-[#FCECE5]/50 border border-[#EADFCF] p-6 sm:p-8 md:p-10 shadow-xs"
    >
      {/* Decorative botanical flourishes in background */}
      <div 
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#559C91]/5 blur-2xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-[#F08070]/10 blur-xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Column: Warm Heading & Dynamic Duration */}
        <div className="space-y-3 max-w-2xl">
          
          {/* Badge: Journey Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#EADFCF] text-[#45362F] shadow-xs">
            {isPregnant ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#559C91]" />
                <span className="text-[#559C91]">Pregnancy Care Journey</span>
              </>
            ) : (
              <>
                <Baby className="w-3.5 h-3.5 text-[#F08070]" />
                <span className="text-[#F08070]">Postnatal Recovery Chapter</span>
              </>
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-[#EADFCF]" />
            <span className="text-[#705B51]">Care for her. Care for them.</span>
          </div>

          {/* Main Personalized Greeting */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#45362F] tracking-tight leading-tight">
            {isPregnant ? (
              <>
                Congratulations, {userName}! <span className="text-[#F08070] inline-block">♡</span>
              </>
            ) : (
              <>
                Welcome to this beautiful new chapter, {userName}! <span className="text-[#F08070] inline-block">♡</span>
              </>
            )}
          </h1>

          {/* Dynamic Clinically Calculated Stage */}
          {isPregnant ? (
            <div className="space-y-2">
              {pregnancyProgress?.isValid ? (
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#EEF4EC] text-[#559C91] border border-[#559C91]/30 font-semibold text-base sm:text-lg">
                    <Clock className="w-4 h-4 text-[#559C91]" />
                    <span>
                      You&apos;re <strong>{pregnancyProgress.weeks} weeks</strong> into your pregnancy journey.
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EADFCF] text-xs font-semibold text-[#705B51]">
                    <span>Month {pregnancyProgress.month}</span>
                    <span className="text-[#EADFCF]">•</span>
                    <span>{pregnancyProgress.trimester}</span>
                  </span>
                </div>
              ) : (
                <div className="pt-1">
                  <p className="text-sm sm:text-base font-medium text-[#705B51]">
                    Your pregnancy journey is blooming, one precious day at a time.
                  </p>
                </div>
              )}

              {/* Encouraging Supportive Message */}
              <p className="text-base sm:text-lg text-[#705B51] font-normal leading-relaxed pt-1">
                &ldquo;Every little step matters. We&apos;re here to support you and your little one, one day at a time.&rdquo;
              </p>
            </div>
          ) : (
            /* Postnatal Case */
            <div className="space-y-2">
              {postnatalProgress?.isValid ? (
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FCECE5] text-[#F08070] border border-[#F08070]/30 font-semibold text-base sm:text-lg">
                    <Clock className="w-4 h-4 text-[#F08070]" />
                    <span>
                      {postnatalProgress.durationText}.
                    </span>
                  </div>

                  {postnatalProgress.months > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EADFCF] text-xs font-semibold text-[#705B51]">
                      <span>~{postnatalProgress.months} {postnatalProgress.months === 1 ? 'Month' : 'Months'} Postpartum</span>
                    </span>
                  )}
                </div>
              ) : (
                <div className="pt-1">
                  <p className="text-sm sm:text-base font-medium text-[#705B51]">
                    Embracing your tender postpartum healing and newborn bonding.
                  </p>
                </div>
              )}

              {/* Encouraging Supportive Message */}
              <p className="text-base sm:text-lg text-[#705B51] font-normal leading-relaxed pt-1">
                &ldquo;Your motherhood journey continues, and you deserve care, rest, and support along the way.&rdquo;
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Date Setting & Quick Care Card */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 min-w-[240px]">
          
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-[#EADFCF] p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#705B51]">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {isPregnant ? 'Estimated Due Date' : 'Delivery Date'}
              </span>
              <button
                onClick={onOpenDateModal}
                className="text-[#559C91] hover:text-[#45362F] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Update your date"
              >
                <Edit3 className="w-3 h-3" />
                <span>{((isPregnant && currentUser?.dueDate) || (!isPregnant && currentUser?.deliveryDate)) ? 'Edit' : 'Set'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF9F1] border border-[#EADFCF] flex items-center justify-center text-[#559C91]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#45362F]">
                  {isPregnant 
                    ? (pregnancyProgress?.isValid ? pregnancyProgress.dueDateFormatted : 'Not yet set')
                    : (postnatalProgress?.isValid ? postnatalProgress.deliveryDateFormatted : 'Not yet set')
                  }
                </p>
                <p className="text-[11px] text-[#705B51]">
                  {isPregnant 
                    ? (pregnancyProgress?.isValid ? `${pregnancyProgress.remainingWeeks} weeks remaining` : 'Tap edit to calculate weeks')
                    : (postnatalProgress?.isValid ? `Baby is ${postnatalProgress.elapsedDays} days young` : 'Tap edit to track weeks')
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Quick Affirmation Pill */}
          <div className="px-4 py-2.5 rounded-2xl bg-[#FFF9F1] border border-[#EADFCF]/70 flex items-center gap-2.5 text-xs text-[#705B51]">
            <Heart className="w-3.5 h-3.5 text-[#F08070] fill-[#F08070] shrink-0" />
            <span>Gentle reminder: Your emotional comfort is always essential.</span>
          </div>

        </div>

      </div>
    </section>
  );
}
