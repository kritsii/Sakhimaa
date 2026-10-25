import React, { useState } from 'react';
import { BookOpen, Heart, Info, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import ThemedDropdown from './ThemedDropdown';
import FeatureTip from './FeatureTip';

const getStorageKey = (userId) => `sakhimaa-breastfeeding-${userId || 'guest'}`;

const breastfeedingGuide = [
  {
    title: 'Find a comfortable position',
    text: 'Settle your shoulders and support your arms and back. Bring your baby close to you rather than leaning forward. A pillow or a different hold may help; a lactation professional can show options that suit you both.',
  },
  {
    title: 'Notice your baby’s cues',
    text: 'Babies may show they are ready to feed by becoming more alert, bringing hands toward the mouth, or turning toward touch. Crying can be a later cue. Cues vary—ask your care team if you are unsure what to look for.',
  },
  {
    title: 'Get help with discomfort',
    text: 'If feeding is painful, your baby has difficulty attaching, or you are worried about feeding or milk supply, reach out early to your healthcare professional or a qualified lactation professional. You deserve support.',
  },
  {
    title: 'Choose the support that fits',
    text: 'Families may feed in different ways, including nursing, expressed milk, formula, or a combination. Your care team can help you make a safe plan for your baby and your circumstances.',
  },
];

function getLocalDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function readSessions(userId) {
  const saved = window.localStorage.getItem(getStorageKey(userId));
  if (!saved) return [];

  const sessions = JSON.parse(saved);
  if (!Array.isArray(sessions) || sessions.some((session) =>
    !session || typeof session.id !== 'string'
    || typeof session.loggedAt !== 'string' || Number.isNaN(Date.parse(session.loggedAt))
    || !['nursing', 'expressed', 'combination', 'other'].includes(session.method)
    || (session.side !== null && !['left', 'right', 'both'].includes(session.side))
    || (session.duration !== null && (!Number.isInteger(session.duration) || session.duration < 0))
    || typeof session.notes !== 'string'
  )) {
    throw new Error('Saved breastfeeding session data is not in the expected format.');
  }

  return sessions;
}

export default function BreastfeedingSupport({ userId, onBackToDashboard }) {
  const [savedState] = useState(() => {
    try {
      return { sessions: readSessions(userId), storageReady: true, error: '' };
    } catch (error) {
      console.error('Unable to read saved breastfeeding sessions.', error);
      return {
        sessions: [],
        storageReady: false,
        error: 'Saved session data could not be loaded. Existing data has been left untouched.',
      };
    }
  });
  const [sessions, setSessions] = useState(savedState.sessions);
  const [storageError, setStorageError] = useState(savedState.error);
  const [form, setForm] = useState({
    loggedAt: getLocalDateTime(),
    method: 'nursing',
    side: 'both',
    duration: '',
    notes: '',
  });

  const saveSessions = (nextSessions) => {
    setSessions(nextSessions);
    if (!savedState.storageReady) {
      setStorageError('Changes are only available until you leave this page because saved data could not be loaded.');
      return;
    }

    try {
      window.localStorage.setItem(getStorageKey(userId), JSON.stringify(nextSessions));
      setStorageError('');
    } catch (error) {
      console.error('Unable to save breastfeeding sessions.', error);
      setStorageError('Changes could not be saved on this device. Check your browser storage settings.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const loggedAt = new Date(form.loggedAt);
    if (Number.isNaN(loggedAt.getTime())) {
      setStorageError('Choose a valid date and time for this session.');
      return;
    }

    const session = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      loggedAt: loggedAt.toISOString(),
      method: form.method,
      side: form.method === 'nursing' ? form.side : null,
      duration: form.duration === '' ? null : Number(form.duration),
      notes: form.notes.trim(),
    };

    saveSessions([session, ...sessions]);
    setForm((current) => ({
      ...current,
      loggedAt: getLocalDateTime(),
      duration: '',
      notes: '',
    }));
  };

  const methodLabels = {
    nursing: 'Nursing',
    expressed: 'Expressed milk',
    combination: 'Combination',
    other: 'Other',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <section className="relative rounded-3xl border border-[#EADFCF] bg-gradient-to-br from-[#FFF9F1] via-[#FFFBF6] to-[#FCECE5]/60 p-6 shadow-xs sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FCECE5] text-[#D98F96]">
            <Heart className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex-1 pr-14 sm:pr-20">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#D98F96]">Support for your feeding journey</p>
            <h1 className="font-serif text-3xl font-bold text-[#45362F] sm:text-4xl">Breastfeeding support</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-[#705B51]">
              Keep a personal record of feeding sessions and any notes you want to remember or discuss with your care team.
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7">
          <FeatureTip tip="Feeding can look different for every family. This log does not set a schedule or assess milk intake. For feeding concerns or hands-on help, contact your healthcare professional or a qualified lactation professional." />
        </div>
      </section>

      <section aria-labelledby="breastfeeding-guide-title" className="space-y-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#A95E67]">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            A gentle starting point
          </div>
          <h2 id="breastfeeding-guide-title" className="font-serif text-2xl font-bold text-[#45362F] sm:text-3xl">
            Feeding guidance for you and your baby
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#705B51]">
            Every feeding journey is different. Use these general pointers as conversation starters, not as rules or a substitute for personal care.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {breastfeedingGuide.map((item) => (
            <article key={item.title} className="rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-xs sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#D98F96]" aria-hidden="true" />
                <h3 className="font-serif text-lg font-bold text-[#45362F]">{item.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-[#705B51]">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-[#5F7C58]/20 bg-[#EEF4EC] p-4 text-sm leading-relaxed text-[#4D6947]">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>Seek prompt professional advice if your baby is difficult to wake for feeds, is not feeding as expected, or you are concerned about their health. If your baby seems seriously unwell or has trouble breathing, seek emergency help.</p>
        </div>
      </section>

      <section aria-labelledby="feeding-log-title" className="rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-xs sm:p-7">
        <h2 id="feeding-log-title" className="mb-5 font-serif text-2xl font-bold text-[#45362F]">Log a feeding session</h2>

        {storageError && (
          <p role="alert" className="mb-5 rounded-xl border border-[#D98F96]/40 bg-[#FCECE5] px-4 py-3 text-sm text-[#80545A]">{storageError}</p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-[#705B51]">
            Date and time
            <input
              required
              type="datetime-local"
              value={form.loggedAt}
              onChange={(event) => setForm((current) => ({ ...current, loggedAt: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/20"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51]">
            Feeding method
            <ThemedDropdown
              id="breastfeeding-method"
              label="Feeding method"
              value={form.method}
              options={Object.entries(methodLabels).map(([value, label]) => ({ value, label }))}
              onChange={(method) => setForm((current) => ({ ...current, method }))}
            />
          </label>
          {form.method === 'nursing' && (
            <label className="text-sm font-medium text-[#705B51]">
              Side, if you wish
              <ThemedDropdown
                id="breastfeeding-side"
                label="Side, if you wish"
                value={form.side}
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                  { value: 'both', label: 'Both' },
                ]}
                onChange={(side) => setForm((current) => ({ ...current, side }))}
              />
            </label>
          )}
          <label className="text-sm font-medium text-[#705B51]">
            Duration in minutes <span className="font-normal text-[#9E8B81]">(optional)</span>
            <input
              type="number"
              min="0"
              step="1"
              value={form.duration}
              onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/20"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51] sm:col-span-2">
            Notes <span className="font-normal text-[#9E8B81]">(optional)</span>
            <textarea
              rows="2"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Anything you would like to remember"
              className="mt-1.5 w-full resize-y rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/20"
            />
          </label>
          <button type="submit" className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#D98F96] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C67981] focus:outline-none focus:ring-2 focus:ring-[#D98F96] focus:ring-offset-2 cursor-pointer">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Save session
          </button>
        </form>
      </section>

      <section aria-labelledby="feeding-sessions-title" className="space-y-3">
        <h2 id="feeding-sessions-title" className="font-serif text-2xl font-bold text-[#45362F]">Your sessions</h2>
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EADFCF] bg-[#FFFDF9] px-5 py-8 text-center">
            <p className="font-medium text-[#45362F]">No sessions logged yet</p>
            <p className="mt-1 text-sm text-[#705B51]">You can add a session whenever it is useful to you.</p>
          </div>
        ) : sessions.map((session) => (
          <article key={session.id} className="flex items-start justify-between gap-4 rounded-2xl border border-[#EADFCF] bg-[#FFFDF9] p-4 sm:p-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-[#45362F]">{methodLabels[session.method]}</h3>
                {session.side && <span className="rounded-full bg-[#FCECE5] px-2.5 py-1 text-xs font-medium capitalize text-[#A95E67]">Side: {session.side}</span>}
              </div>
              <time className="mt-1 block text-sm text-[#705B51]" dateTime={session.loggedAt}>{new Date(session.loggedAt).toLocaleString()}</time>
              {session.duration !== null && <p className="mt-1 text-sm text-[#705B51]">{session.duration} {session.duration === 1 ? 'minute' : 'minutes'}</p>}
              {session.notes && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#705B51]">{session.notes}</p>}
            </div>
            <button
              type="button"
              onClick={() => saveSessions(sessions.filter((item) => item.id !== session.id))}
              aria-label={`Remove ${methodLabels[session.method]} session`}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#9E8B81] transition-colors hover:bg-[#FCECE5] hover:text-[#A8535D] focus:outline-none focus:ring-2 focus:ring-[#D98F96] cursor-pointer"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </section>

      <p className="text-xs leading-relaxed text-[#9E8B81]">Sessions are saved in this browser on this device under your account. They are not backed up or shared with your care team.</p>
    </div>
  );
}
