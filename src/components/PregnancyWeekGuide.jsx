import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CalendarHeart,
  Heart,
  Info,
  Sparkles,
} from 'lucide-react';
import ThemedDropdown from './ThemedDropdown';
import {
  calculatePregnancyProgress,
  getPregnancyMonth,
  getPregnancyTrimester,
} from '../utils/dateCalculations';

const weekOptions = Array.from({ length: 42 }, (_, index) => {
  const week = index + 1;
  return { value: String(week), label: `Week ${week}` };
});

const trimesterGuidance = {
  'First Trimester': {
    title: 'Early pregnancy: taking things one step at a time',
    description: 'Early pregnancy can bring many changes, and experiences differ from person to person. Make space for rest and discuss questions, symptoms, medicines, and supplements with your maternity care team.',
    topics: [
      'Ask your care team which appointments and tests are appropriate for you and when they should happen.',
      'Check with a healthcare professional before starting, stopping, or changing medicines or supplements.',
      'If nausea or tiredness is affecting daily life, your care team can discuss supportive options.',
    ],
  },
  'Second Trimester': {
    title: 'Mid-pregnancy: staying connected with your care',
    description: 'This stage is a good time to keep up with recommended visits and talk through any changes or concerns. Your care team can explain which checks are relevant to your individual pregnancy.',
    topics: [
      'Keep a note of questions to bring to your next appointment.',
      'Ask your clinician about movement, activity, sleep, or discomfort that is on your mind.',
      'Follow the testing and screening plan recommended by your own maternity care team.',
    ],
  },
  'Third Trimester': {
    title: 'Later pregnancy: preparing with support',
    description: 'As your pregnancy progresses, your care team can guide you through upcoming visits, birth planning, and what to expect for your circumstances.',
    topics: [
      'Confirm with your care team how to reach them if you have questions between visits.',
      'Discuss your birth preferences and any practical preparations that would help you feel ready.',
      'Ask which symptoms or changes should prompt a call or urgent assessment for you.',
    ],
  },
};

function getWeekGuidance(week, trimester) {
  const guidance = trimesterGuidance[trimester];
  const topic = guidance.topics[(week - 1) % guidance.topics.length];

  return {
    title: `A gentle guide to week ${week}`,
    description: `${guidance.description} Pregnancy experiences and care plans vary; your clinician is the best person to advise you about your health.`,
    topic,
  };
}

export default function PregnancyWeekGuide({ dueDate, onBackToDashboard }) {
  const progress = calculatePregnancyProgress(dueDate);
  const initialWeek = progress.isValid ? progress.weeks : 1;
  const [selectedWeek, setSelectedWeek] = useState(String(initialWeek));
  const week = Number(selectedWeek);
  const trimester = getPregnancyTrimester(week);
  const month = getPregnancyMonth(week);
  const stageGuidance = trimesterGuidance[trimester];
  const weekGuidance = getWeekGuidance(week, trimester);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 border-b border-[#EADFCF] pb-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 rounded-full border border-[#EADFCF] bg-white px-4 py-2 text-sm font-semibold text-[#45362F] shadow-xs transition-colors hover:border-[#559C91] hover:text-[#559C91] focus:outline-none focus:ring-2 focus:ring-[#559C91] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </button>
        <span className="rounded-full border border-[#8B7BB0]/30 bg-[#F3EFF9] px-3 py-1 text-xs font-semibold text-[#755F91]">
          Pregnancy guidance
        </span>
      </div>

      <section className="rounded-3xl border border-[#EADFCF] bg-gradient-to-br from-[#FFF9F1] via-[#FFFBF6] to-[#F3EFF9] p-6 shadow-xs sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3EFF9] text-[#8B7BB0]">
            <BookOpen className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8B7BB0]">A calm companion for your journey</p>
            <h1 className="font-serif text-3xl font-bold text-[#45362F] sm:text-4xl">Pregnancy week &amp; health guide</h1>
            <p className="mt-3 max-w-3xl leading-relaxed text-[#705B51]">
              Browse general wellbeing guidance by week and trimester. This is an educational guide—not a tracker, diagnosis, or personalized care plan.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="select-guide-week-title" className="rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-xs sm:p-7">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h2 id="select-guide-week-title" className="font-serif text-xl font-bold text-[#45362F]">Choose a week to explore</h2>
            <p className="mt-1 text-sm leading-relaxed text-[#705B51]">
              {progress.isValid
                ? `Your guide opens at week ${progress.weeks}, based on the due date saved in your profile. You can browse another week at any time.`
                : 'Select a week to browse general guidance. Add or update your due date in your profile if you would like the guide to open near your current stage.'}
            </p>
          </div>
          <div className="w-full sm:w-48">
            <ThemedDropdown
              id="pregnancy-guide-week"
              label="Choose pregnancy week"
              value={selectedWeek}
              options={weekOptions}
              onChange={setSelectedWeek}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="selected-week-title" className="rounded-3xl border border-[#EADFCF] bg-gradient-to-br from-[#FFFDF9] to-[#F4F0FA] p-6 shadow-xs sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#F3EFF9] px-3 py-1 text-xs font-semibold text-[#755F91]">Week {week}</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#705B51]">Month {month}</span>
          <span className="rounded-full bg-[#EEF4EC] px-3 py-1 text-xs font-semibold text-[#4D6947]">{trimester}</span>
        </div>
        <h2 id="selected-week-title" className="mt-4 font-serif text-2xl font-bold text-[#45362F] sm:text-3xl">
          {weekGuidance.title}
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-[#705B51]">{weekGuidance.description}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[#EADFCF] bg-white/90 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#D98F96]" aria-hidden="true" />
              <h3 className="font-serif text-lg font-bold text-[#45362F]">{stageGuidance.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#705B51]">{stageGuidance.description}</p>
          </article>
          <article className="rounded-2xl border border-[#EADFCF] bg-white/90 p-5">
            <div className="mb-3 flex items-center gap-2">
              <CalendarHeart className="h-5 w-5 text-[#5F7C58]" aria-hidden="true" />
              <h3 className="font-serif text-lg font-bold text-[#45362F]">A question to consider</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#705B51]">{weekGuidance.topic}</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="wellbeing-guide-title" className="rounded-3xl border border-[#EADFCF] bg-[#FFF9F1] p-5 shadow-xs sm:p-7">
        <div className="mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-[#D98F96]" aria-hidden="true" />
          <h2 id="wellbeing-guide-title" className="font-serif text-xl font-bold text-[#45362F]">Gentle wellbeing reminders</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            'Rest when you can, and ask for practical support when you need it.',
            'Follow advice from your maternity care team about food, medicines, supplements, and activity.',
            'Reach out to your clinician when something worries you; you do not need to wait for a routine visit.',
          ].map((reminder) => (
            <li key={reminder} className="rounded-2xl border border-[#EADFCF] bg-white p-4 text-sm leading-relaxed text-[#705B51]">{reminder}</li>
          ))}
        </ul>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-[#EADFCF] bg-[#F7F1E8] p-4 text-xs leading-relaxed text-[#705B51]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#8667A0]" aria-hidden="true" />
        <p>
          This guide provides general educational information and cannot assess your pregnancy or replace care from a qualified healthcare professional. Guidance and recommended timing can vary by person and location. Contact your maternity care team for advice specific to you; seek urgent or emergency care for severe or concerning symptoms.
        </p>
      </div>
    </div>
  );
}
