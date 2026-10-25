import React, { useState } from 'react';
import { Activity, CalendarDays, Plus, Trash2 } from 'lucide-react';
import ThemedDropdown from './ThemedDropdown';
import FeatureTip from './FeatureTip';

const STORAGE_KEY = 'sakhimaa-symptoms';
const TODAY_ON_LOAD = getToday();
const OTHER_SYMPTOM = 'Other';

const stageSymptoms = {
  pregnant: [
    'Nausea',
    'Vomiting',
    'Abdominal pain or cramps',
    'Headache',
    'Dizziness',
    'Back pain',
    'Swelling',
    'Heartburn',
    'Fatigue',
    'Bleeding or spotting',
    'Change in fetal movement',
    OTHER_SYMPTOM
  ],
  postnatal: [
    'Low mood or feeling depressed',
    'Bleeding',
    'Perineal pain or tearing',
    'C-section incision concern',
    'Breast pain or engorgement',
    'Fever or chills',
    'Headache',
    'Swelling',
    'Pelvic pain',
    'Urinary discomfort',
    'Difficulty coping or anxiety',
    OTHER_SYMPTOM
  ]
};

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readSavedSymptoms() {
  const savedSymptoms = window.localStorage.getItem(STORAGE_KEY);
  if (!savedSymptoms) return [];

  const parsedSymptoms = JSON.parse(savedSymptoms);
  if (!Array.isArray(parsedSymptoms) || parsedSymptoms.some((symptom) =>
    !symptom || typeof symptom.id !== 'string' || typeof symptom.name !== 'string'
    || typeof symptom.date !== 'string' || !Number.isInteger(symptom.severity)
    || symptom.severity < 1 || symptom.severity > 5
    || !['pregnant', 'postnatal'].includes(symptom.journey)
  )) {
    throw new Error('Saved symptom data is not in the expected format.');
  }

  return parsedSymptoms;
}

export default function SymptomTracker({ initialJourney }) {
  const selectedJourney = initialJourney === 'postnatal' ? 'postnatal' : 'pregnant';
  const [savedState] = useState(() => {
    try {
      return { symptoms: readSavedSymptoms(), storageReady: true, error: '' };
    } catch (error) {
      console.error('Unable to read saved symptoms.', error);
      return {
        symptoms: [],
        storageReady: false,
        error: 'Saved symptoms could not be loaded. Your existing data has been left untouched.'
      };
    }
  });
  const [symptoms, setSymptoms] = useState(savedState.symptoms);
  const [storageReady] = useState(savedState.storageReady);
  const [storageError, setStorageError] = useState(savedState.error);
  const [form, setForm] = useState({
    name: '',
    otherSymptom: '',
    date: TODAY_ON_LOAD,
    severity: '3',
    notes: ''
  });

  const saveSymptoms = (nextSymptoms) => {
    setSymptoms(nextSymptoms);
    if (!storageReady) {
      setStorageError('Changes are only available until you leave this page because saved data could not be loaded.');
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSymptoms));
      setStorageError('');
    } catch (error) {
      console.error('Unable to save symptoms.', error);
      setStorageError('Changes could not be saved on this device. Check your browser storage settings.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleAddSymptom = (event) => {
    event.preventDefault();
    const name = (form.name === OTHER_SYMPTOM ? form.otherSymptom : form.name).trim();
    if (!name) return;

    const newSymptom = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      journey: selectedJourney,
      date: form.date,
      severity: Number(form.severity),
      notes: form.notes.trim()
    };

    saveSymptoms([newSymptom, ...symptoms]);
    setForm((currentForm) => ({ ...currentForm, name: '', otherSymptom: '', severity: '3', notes: '' }));
  };

  const severityLabels = {
    1: 'Mild',
    2: 'A little uncomfortable',
    3: 'Moderate',
    4: 'Quite severe',
    5: 'Severe'
  };

  return (
    <section
      className="rounded-[24px] border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-sm sm:p-8"
      aria-labelledby="symptom-tracker-title"
    >
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#D98F96]">Notice patterns, share with your care team</p>
          <h1 id="symptom-tracker-title" className="font-serif text-2xl font-bold text-[#45362F] sm:text-3xl">
            Symptom tracker
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 max-w-lg">
          <p className="text-sm leading-relaxed text-[#705B51] flex-1">
            Record how you feel over time, during pregnancy or postpartum. Your notes can help you prepare for a conversation with your care team.
          </p>
          <div className="self-end shrink-0">
            <FeatureTip tip="Tracking symptoms regularly helps your clinician understand progression. If you experience warning signs like severe headache, vision changes, or intense abdominal pain, seek medical care right away." />
          </div>
        </div>
      </div>

      {storageError && (
        <p role="alert" className="mb-5 rounded-xl border border-[#D98F96]/40 bg-[#FCECE5] px-4 py-3 text-sm text-[#80545A]">
          {storageError}
        </p>
      )}

      <form onSubmit={handleAddSymptom} className="mb-8 rounded-2xl bg-[#FDF4F0] p-4 sm:p-6">
        <h2 className="mb-4 font-semibold text-[#45362F]">Add a symptom entry</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-sm font-medium text-[#705B51]">
            Selected stage
            <p className="mt-1.5 flex min-h-11 items-center">
              <span className="rounded-full bg-[#FCECE5] px-3.5 py-2 text-sm font-semibold text-[#A95E67]">
                {selectedJourney === 'pregnant' ? 'Pregnancy' : 'Postpartum'}
              </span>
            </p>
          </div>
          <label className="text-sm font-medium text-[#705B51]">
            Symptom
            <ThemedDropdown
              id="symptom-select"
              label="Symptom"
              value={form.name}
              placeholder="Select a symptom"
              options={stageSymptoms[selectedJourney].map((symptom) => ({ value: symptom, label: symptom }))}
              onChange={(name) => setForm((currentForm) => ({ ...currentForm, name, otherSymptom: '' }))}
            />
          </label>
          {form.name === OTHER_SYMPTOM && (
            <label className="text-sm font-medium text-[#705B51]">
              Describe the symptom
              <input
                required
                name="otherSymptom"
                value={form.otherSymptom}
                onChange={handleChange}
                placeholder="Enter another symptom"
                className="mt-1.5 w-full rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/20"
              />
            </label>
          )}
          <label className="text-sm font-medium text-[#705B51]">
            Date
            <input
              required
              type="date"
              name="date"
              value={form.date}
              max={TODAY_ON_LOAD}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/20"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51]">
            How intense was it?
            <ThemedDropdown
              id="severity-select"
              label="How intense was it?"
              value={form.severity}
              options={Object.entries(severityLabels).map(([value, label]) => ({ value, label }))}
              onChange={(severity) => setForm((currentForm) => ({ ...currentForm, severity }))}
            />
          </label>
        </div>
        <label className="mt-4 block text-sm font-medium text-[#705B51]">
          Notes <span className="font-normal text-[#9E8B81]">(optional)</span>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Add details such as when it started or anything that seemed to affect it"
            className="mt-1.5 w-full resize-y rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/20"
          />
        </label>
        <button
          type="submit"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#D98F96] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C67981] focus:outline-none focus:ring-2 focus:ring-[#D98F96] focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Save symptom
        </button>
      </form>

      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-5 w-5 text-[#D98F96]" aria-hidden="true" />
        <h2 className="font-serif text-xl font-bold text-[#45362F]">Your entries</h2>
      </div>
      <div className="space-y-3">
        {symptoms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EADFCF] px-5 py-8 text-center">
            <p className="font-medium text-[#45362F]">No symptoms recorded yet</p>
            <p className="mt-1 text-sm text-[#705B51]">Add an entry above to start tracking how you feel.</p>
          </div>
        ) : (
          symptoms.map((symptom) => (
            <article key={symptom.id} className="flex flex-col gap-4 rounded-2xl border border-[#EADFCF] bg-white p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#45362F]">{symptom.name}</h3>
                  <span className="rounded-full bg-[#FCECE5] px-2.5 py-1 text-xs font-medium text-[#A95E67]">
                    {symptom.journey === 'pregnant' ? 'Pregnancy' : 'Postpartum'}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-[#705B51]">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={symptom.date}>{symptom.date}</time>
                </p>
                <p className="mt-1 text-sm text-[#705B51]">
                  Intensity: {symptom.severity}/5 — {severityLabels[symptom.severity]}
                </p>
                {symptom.notes && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#9E8B81]">{symptom.notes}</p>}
              </div>
              <button
                type="button"
                onClick={() => saveSymptoms(symptoms.filter((item) => item.id !== symptom.id))}
                aria-label={`Remove ${symptom.name} entry`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-full text-[#9E8B81] transition-colors hover:bg-[#FCECE5] hover:text-[#A8535D] focus:outline-none focus:ring-2 focus:ring-[#D98F96] sm:self-start"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </article>
          ))
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-[#EADFCF] bg-[#FFF9F1] p-4">
        <p className="text-sm leading-relaxed text-[#705B51]">
          This tracker does not diagnose symptoms or determine whether they are urgent. If you are worried, symptoms are severe or worsening, or you think you need immediate care, contact your healthcare professional or local emergency service.
        </p>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-[#9E8B81]">
        Entries are saved in this browser on this device. They are not backed up or shared with your care team.
      </p>
    </section>
  );
}
