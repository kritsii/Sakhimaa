import React, { useState } from 'react';
import { Baby, BookOpen, Info, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import ThemedDropdown from './ThemedDropdown';
import FeatureTip from './FeatureTip';

const STORAGE_KEY_PREFIX = 'sakhimaa-newborn-care-';
const LOG_TYPES = ['Feeding', 'Diaper', 'Sleep', 'Appointment', 'Note'];

const careGuide = [
  {
    title: 'Safer sleep',
    text: 'For every sleep, place your baby on their back on a firm, flat sleep surface designed for infants. Keep the sleep space clear of pillows, loose blankets, soft toys, and other objects. Ask your healthcare professional for advice tailored to your baby.',
  },
  {
    title: 'Feeding and everyday care',
    text: 'Follow the feeding plan you discussed with your baby’s healthcare professional. If you are unsure about feeding, preparation, or how much your baby is taking, contact them rather than relying on a tracker to decide.',
  },
  {
    title: 'Diapers and observations',
    text: 'A simple log can help you remember feeds, diaper changes, and questions for checkups. Your baby’s needs change over time; ask your care team what patterns and changes are expected for your baby.',
  },
  {
    title: 'Umbilical cord and skin',
    text: 'Follow the instructions from your maternity or newborn care team for cord care and bathing. If the cord area looks increasingly red, has discharge, or you are concerned, contact your baby’s healthcare professional.',
  },
  {
    title: 'Keep checkups and questions together',
    text: 'Use appointments to discuss feeding, sleep, diapers, growth, and anything that feels different. Writing questions down here can make them easier to bring up during a visit.',
  },
];

const getStorageKey = (userId) => `${STORAGE_KEY_PREFIX}${userId || 'guest'}`;

function getLocalDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function readEntries(userId) {
  const saved = window.localStorage.getItem(getStorageKey(userId));
  if (!saved) return [];

  const entries = JSON.parse(saved);
  if (!Array.isArray(entries) || entries.some((entry) =>
    !entry || typeof entry.id !== 'string'
    || typeof entry.loggedAt !== 'string' || Number.isNaN(Date.parse(entry.loggedAt))
    || !LOG_TYPES.includes(entry.type) || typeof entry.details !== 'string'
  )) {
    throw new Error('Saved newborn care data is not in the expected format.');
  }

  return entries;
}

export default function NewbornCare({ userId, onBackToDashboard }) {
  const [savedState] = useState(() => {
    try {
      return { entries: readEntries(userId), storageReady: true, error: '' };
    } catch (error) {
      console.error('Unable to read saved newborn care entries.', error);
      return {
        entries: [],
        storageReady: false,
        error: 'Saved care entries could not be loaded. Existing data has been left untouched.',
      };
    }
  });
  const [entries, setEntries] = useState(savedState.entries);
  const [storageError, setStorageError] = useState(savedState.error);
  const [form, setForm] = useState({
    type: 'Feeding',
    loggedAt: getLocalDateTime(),
    details: '',
  });

  const saveEntries = (nextEntries) => {
    setEntries(nextEntries);
    if (!savedState.storageReady) {
      setStorageError('Changes are only available until you leave this page because saved data could not be loaded.');
      return;
    }

    try {
      window.localStorage.setItem(getStorageKey(userId), JSON.stringify(nextEntries));
      setStorageError('');
    } catch (error) {
      console.error('Unable to save newborn care entries.', error);
      setStorageError('Changes could not be saved on this device. Check your browser storage settings.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const loggedAt = new Date(form.loggedAt);
    const details = form.details.trim();
    if (Number.isNaN(loggedAt.getTime())) {
      setStorageError('Choose a valid date and time for this entry.');
      return;
    }
    if (!details) return;

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: form.type,
      loggedAt: loggedAt.toISOString(),
      details,
    };

    saveEntries([entry, ...entries]);
    setForm((current) => ({
      ...current,
      loggedAt: getLocalDateTime(),
      details: '',
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <section className="relative rounded-3xl border border-[#EADFCF] bg-gradient-to-br from-[#FFF9F1] via-[#FFFBF6] to-[#EEF4EC] p-6 shadow-xs sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4EC] text-[#5F7C58]">
            <Baby className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex-1 pr-14 sm:pr-20">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5F7C58]">Little moments, thoughtfully organized</p>
            <h1 className="font-serif text-3xl font-bold text-[#45362F] sm:text-4xl">Newborn care</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-[#705B51]">
              Keep feeding notes, diaper changes, sleep observations, appointments, and other reminders together in one private log.
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7">
          <FeatureTip tip="This log is for organizing your own observations. It does not assess your baby’s health or replace advice from your child’s healthcare professional. Contact them if you have concerns." />
        </div>
      </section>

      <section aria-labelledby="newborn-guide-title" className="space-y-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5F7C58]">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Everyday newborn care
          </div>
          <h2 id="newborn-guide-title" className="font-serif text-2xl font-bold text-[#45362F] sm:text-3xl">
            A gentle guide for the early days
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#705B51]">
            A few general care reminders to support conversations with your baby’s healthcare professional. Your baby may need individualized guidance.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {careGuide.map((item) => (
            <article key={item.title} className="rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-xs sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Baby className="h-4 w-4 text-[#5F7C58]" aria-hidden="true" />
                <h3 className="font-serif text-lg font-bold text-[#45362F]">{item.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-[#705B51]">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-[#D98F96]/30 bg-[#FCECE5] p-4 text-sm leading-relaxed text-[#80545A]">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>Contact your baby’s healthcare professional promptly if you are worried about feeding, unusual sleepiness, fewer wet diapers than expected, fever, or any change that concerns you. For difficulty breathing, blue or gray color, or if your baby is unresponsive, seek emergency help now.</p>
        </div>
      </section>

      <section aria-labelledby="newborn-log-title" className="rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-xs sm:p-7">
        <h2 id="newborn-log-title" className="mb-5 font-serif text-2xl font-bold text-[#45362F]">Add a care entry</h2>

        {storageError && (
          <p role="alert" className="mb-5 rounded-xl border border-[#D98F96]/40 bg-[#FCECE5] px-4 py-3 text-sm text-[#80545A]">{storageError}</p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-[#705B51]">
            Entry type
            <ThemedDropdown
              id="newborn-entry-type"
              label="Entry type"
              value={form.type}
              options={LOG_TYPES.map((type) => ({ value: type, label: type }))}
              onChange={(type) => setForm((current) => ({ ...current, type }))}
            />
          </label>
          <label className="text-sm font-medium text-[#705B51]">
            Date and time
            <input
              required
              type="datetime-local"
              value={form.loggedAt}
              onChange={(event) => setForm((current) => ({ ...current, loggedAt: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#5F7C58] focus:ring-2 focus:ring-[#A8BCA1]/30"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51] sm:col-span-2">
            Details
            <textarea
              required
              rows="3"
              value={form.details}
              onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))}
              placeholder="Add a brief note to help you remember this entry"
              className="mt-1.5 w-full resize-y rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#5F7C58] focus:ring-2 focus:ring-[#A8BCA1]/30"
            />
          </label>
          <button type="submit" className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#5F7C58] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4D6947] focus:outline-none focus:ring-2 focus:ring-[#5F7C58] focus:ring-offset-2 cursor-pointer">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Save entry
          </button>
        </form>
      </section>

      <section aria-labelledby="newborn-entries-title" className="space-y-3">
        <h2 id="newborn-entries-title" className="font-serif text-2xl font-bold text-[#45362F]">Your care log</h2>
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EADFCF] bg-[#FFFDF9] px-5 py-8 text-center">
            <p className="font-medium text-[#45362F]">No care entries yet</p>
            <p className="mt-1 text-sm text-[#705B51]">Add an entry whenever you would like to keep a note.</p>
          </div>
        ) : entries.map((entry) => (
          <article key={entry.id} className="flex items-start justify-between gap-4 rounded-2xl border border-[#EADFCF] bg-[#FFFDF9] p-4 sm:p-5">
            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-[#EEF4EC] px-2.5 py-1 text-xs font-semibold text-[#4D6947]">{entry.type}</span>
              <time className="mt-2 block text-sm text-[#705B51]" dateTime={entry.loggedAt}>{new Date(entry.loggedAt).toLocaleString()}</time>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#45362F]">{entry.details}</p>
            </div>
            <button
              type="button"
              onClick={() => saveEntries(entries.filter((item) => item.id !== entry.id))}
              aria-label={`Remove ${entry.type.toLowerCase()} entry`}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#9E8B81] transition-colors hover:bg-[#FCECE5] hover:text-[#A8535D] focus:outline-none focus:ring-2 focus:ring-[#D98F96] cursor-pointer"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </article>
        ))}
      </section>

      <p className="text-xs leading-relaxed text-[#9E8B81]">Entries are saved in this browser on this device under your account. They are not backed up or shared with your care team.</p>
    </div>
  );
}
