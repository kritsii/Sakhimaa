import React from 'react';
import {
  HeartPulse,
  FileText,
  Pill,
  CalendarHeart,
  BookOpen,
  Flower2,
  ArrowRight
} from 'lucide-react';

export default function PregnancySection({ onSwitchToPostnatal }) {
  const pregnancyFeatures = [
    {
      title: 'Pregnancy Symptom Tracker',
      icon: HeartPulse,
      description: 'Record symptoms, follow changes over time, and learn when to seek medical advice.',
      accentName: 'Dusty rose',
      iconBg: 'bg-[#FCECE5]',
      iconColor: 'text-[#D98F96]',
      hoverBorder: 'hover:border-[#D98F96]/60 hover:shadow-[#D98F96]/10'
    },
    {
      title: 'Health Report Analysis',
      icon: FileText,
      description: 'Make your health records easier to understand and prepare for doctor visits.',
      accentName: 'Lavender',
      iconBg: 'bg-[#F3EFF9]',
      iconColor: 'text-[#8B7BB0]',
      hoverBorder: 'hover:border-[#8B7BB0]/60 hover:shadow-[#8B7BB0]/10'
    },
    {
      title: 'Medication Tracker',
      icon: Pill,
      description: 'Keep prescribed medicines, supplements, and reminders organised.',
      accentName: 'Sage green',
      iconBg: 'bg-[#EEF4EC]',
      iconColor: 'text-[#5F7C58]',
      hoverBorder: 'hover:border-[#5F7C58]/60 hover:shadow-[#5F7C58]/10'
    },
    {
      title: 'Antenatal Appointment Planner',
      icon: CalendarHeart,
      description: 'Keep track of upcoming checkups, tests, and important appointments.',
      accentName: 'Peach',
      iconBg: 'bg-[#FDF0EA]',
      iconColor: 'text-[#E28A6B]',
      hoverBorder: 'hover:border-[#E28A6B]/60 hover:shadow-[#E28A6B]/10'
    },
    {
      title: 'Pregnancy Week & Health Guide',
      icon: BookOpen,
      description: 'Explore helpful health information relevant to your stage of pregnancy.',
      accentName: 'Pale yellow',
      iconBg: 'bg-[#FEF9EC]',
      iconColor: 'text-[#C29538]',
      hoverBorder: 'hover:border-[#C29538]/60 hover:shadow-[#C29538]/10'
    },
    {
      title: 'Prenatal Yoga & Asanas',
      icon: Flower2,
      description: 'Explore safe yoga asanas and gentle stretches for each trimester to build strength, improve flexibility, and ease discomfort.',
      accentName: 'Soft lilac',
      iconBg: 'bg-[#F5EEF8]',
      iconColor: 'text-[#7D5BA6]',
      hoverBorder: 'hover:border-[#7D5BA6]/60 hover:shadow-[#7D5BA6]/10'
    }
  ];

  return (
    <section
      id="pregnancy-section"
      className="py-16 md:py-24 bg-gradient-to-b from-[#F7F1E8] via-[#FFF9F1] to-[#F7F1E8] relative overflow-hidden transition-all duration-300 border-t border-[#EADFCF]"
      aria-label="Pregnancy Care Section"
    >
      {/* Decorative ambient gradients */}
      <div
        className="absolute top-1/4 -right-24 w-88 h-88 bg-[#F4B49B]/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-20 w-80 h-80 bg-[#D98F96]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Control Bar: Active Badge, Switcher & Hide Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-5 border-b border-[#EADFCF]/70">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCECE5] text-[#D98F96] text-xs font-semibold uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#D98F96]"></span>
            <span>Selected Journey: Pregnancy Care</span>
          </div>

          <div className="flex items-center gap-3">
            {onSwitchToPostnatal && (
              <button
                onClick={onSwitchToPostnatal}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#705B51] hover:text-[#5F7C58] transition-colors cursor-pointer px-3.5 py-1.5 rounded-full bg-[#FFF9F1] border border-[#EADFCF] hover:border-[#A8BCA1] shadow-xs"
                aria-label="Switch to Postnatal Care"
              >
                <span>Switch to Postnatal Care</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Section Header & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#45362F] tracking-tight leading-tight">
            Care for you and your little one, every step of the way.
          </h2>

          <p className="text-base sm:text-lg text-[#705B51] leading-relaxed max-w-2xl mx-auto">
            Understand your changing body, stay organised, and feel more prepared throughout your pregnancy.
          </p>
        </div>

        {/* 5 Feature Cards Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {pregnancyFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative bg-[#FFFDF9] rounded-[22px] p-7 sm:p-8 border border-[#EADFCF]/80 shadow-xs flex flex-col justify-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${feature.hoverBorder}`}
              >
                {/* Pastel Circular Icon Container */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 shrink-0 transition-transform duration-300 group-hover:scale-105 ${feature.iconBg} ${feature.iconColor}`}
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6" strokeWidth={1.8} />
                </div>

                {/* Feature Title */}
                <h3 className="font-serif text-xl sm:text-[22px] font-bold text-[#45362F] tracking-tight mb-2.5">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-sm sm:text-[15px] text-[#705B51] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
