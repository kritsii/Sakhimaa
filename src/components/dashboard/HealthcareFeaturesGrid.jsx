import React from 'react';
import { 
  HeartPulse, 
  FileText, 
  Pill, 
  CalendarHeart, 
  BookOpen, 
  Activity, 
  Heart, 
  Baby, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { 
  PREGNANCY_FEATURE_CARDS, 
  POSTNATAL_FEATURE_CARDS 
} from '../../constants/routes';

// Icon mapping helper
const ICONS = {
  HeartPulse,
  FileText,
  Pill,
  CalendarHeart,
  BookOpen,
  Activity,
  Heart,
  Baby,
};

// Accent styles for icon containers
const ACCENT_STYLES = {
  teal: {
    container: 'bg-[#EEF4EC] text-[#559C91] border-[#559C91]/30 group-hover:bg-[#559C91] group-hover:text-white',
    badge: 'bg-[#EEF4EC] text-[#559C91]',
    hoverBorder: 'hover:border-[#559C91]/60 hover:shadow-[#559C91]/10',
    arrow: 'text-[#559C91]',
  },
  coral: {
    container: 'bg-[#FCECE5] text-[#F08070] border-[#F08070]/30 group-hover:bg-[#F08070] group-hover:text-white',
    badge: 'bg-[#FCECE5] text-[#F08070]',
    hoverBorder: 'hover:border-[#F08070]/60 hover:shadow-[#F08070]/10',
    arrow: 'text-[#F08070]',
  },
  peach: {
    container: 'bg-[#FDF0E6] text-[#E07A5F] border-[#E07A5F]/30 group-hover:bg-[#E07A5F] group-hover:text-white',
    badge: 'bg-[#FDF0E6] text-[#E07A5F]',
    hoverBorder: 'hover:border-[#E07A5F]/60 hover:shadow-[#E07A5F]/10',
    arrow: 'text-[#E07A5F]',
  },
  sage: {
    container: 'bg-[#EEF4EC] text-[#5F7C58] border-[#5F7C58]/30 group-hover:bg-[#5F7C58] group-hover:text-white',
    badge: 'bg-[#EEF4EC] text-[#5F7C58]',
    hoverBorder: 'hover:border-[#5F7C58]/60 hover:shadow-[#5F7C58]/10',
    arrow: 'text-[#5F7C58]',
  },
  lavender: {
    container: 'bg-[#F4EFF8] text-[#8667A0] border-[#8667A0]/30 group-hover:bg-[#8667A0] group-hover:text-white',
    badge: 'bg-[#F4EFF8] text-[#8667A0]',
    hoverBorder: 'hover:border-[#8667A0]/60 hover:shadow-[#8667A0]/10',
    arrow: 'text-[#8667A0]',
  },
};

export default function HealthcareFeaturesGrid({ 
  currentUser, 
  onNavigateToFeature 
}) {
  const isPregnant = currentUser?.journey !== 'postnatal';
  const cards = isPregnant ? PREGNANCY_FEATURE_CARDS : POSTNATAL_FEATURE_CARDS;

  return (
    <section aria-labelledby="features-heading" className="space-y-5">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#559C91] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Healthcare Modules</span>
          </div>
          <h2 id="features-heading" className="font-serif text-2xl sm:text-3xl font-bold text-[#45362F]">
            {isPregnant ? 'Your Pregnancy Healthcare Companion' : 'Your Postnatal Healthcare Companion'}
          </h2>
          <p className="text-sm sm:text-base text-[#705B51] mt-1 max-w-2xl">
            {isPregnant 
              ? 'Every tool and tracker you need to monitor wellness, organize appointments, and embrace motherhood with peace of mind.'
              : 'Dedicated post-delivery support for maternal healing, infant wellbeing, and continuous compassionate care.'}
          </p>
        </div>

        <div className="text-xs font-medium text-[#705B51] shrink-0">
          Showing {cards.length} essential features
        </div>
      </div>

      {/* 3-Column Desktop, 2-Column Tablet, 1-Column Mobile Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const IconComponent = ICONS[card.iconName] || HeartPulse;
          const style = ACCENT_STYLES[card.accent] || ACCENT_STYLES.teal;

          return (
            <button
              key={card.id}
              onClick={() => onNavigateToFeature(card)}
              className={`group text-left rounded-3xl bg-[#FFF9F1] border border-[#EADFCF] p-6 sm:p-7 flex flex-col justify-between h-full shadow-xs transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${style.hoverBorder} focus:outline-none focus:ring-2 focus:ring-[#559C91] cursor-pointer`}
              aria-label={`Open ${card.title}`}
            >
              <div className="space-y-4">
                
                {/* Top Row: Icon Container and Category Badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xs transition-all duration-300 ${style.container}`}>
                    <IconComponent className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                    {card.category}
                  </span>
                </div>

                {/* Card Title & Description */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#45362F] group-hover:text-[#2E241F] transition-colors flex items-center gap-1.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#705B51] leading-relaxed mt-2 line-clamp-3">
                    {card.description}
                  </p>
                </div>

              </div>

              {/* Card Footer: Navigation Indicator */}
              <div className="pt-4 mt-4 border-t border-[#EADFCF]/60 flex items-center justify-end text-xs font-semibold text-[#705B51] group-hover:text-[#45362F]">
                <div className="inline-flex items-center gap-1.5 font-bold transition-transform group-hover:translate-x-1">
                  <span className={style.arrow}>Open Feature</span>
                  <ArrowRight className={`w-4 h-4 ${style.arrow}`} />
                </div>
              </div>

            </button>
          );
        })}
      </div>

    </section>
  );
}
