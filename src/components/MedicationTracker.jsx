import React, { useState } from 'react';
import { Check, Clock3, Plus, Trash2 } from 'lucide-react';
import ThemedDropdown from './ThemedDropdown';
import FeatureTip from './FeatureTip';

const STORAGE_KEY = 'sakhimaa-medications';

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TODAY_ON_LOAD = getToday();

function readSavedMedications() {
  const savedMedications = window.localStorage.getItem(STORAGE_KEY);
  if (!savedMedications) return [];

  const parsedMedications = JSON.parse(savedMedications);
  if (!Array.isArray(parsedMedications) || parsedMedications.some((medication) =>
    !medication || typeof medication.id !== 'string' || typeof medication.name !== 'string'
    || typeof medication.dose !== 'string' || !['daily', 'as-needed'].includes(medication.frequency)
  )) {
    throw new Error('Saved medication data is not in the expected format.');
  }

  return parsedMedications;
}

export default function MedicationTracker() {
  const [savedState] = useState(() => {
    try {
      return { medications: readSavedMedications(), storageReady: true, error: '' };
    } catch (error) {
      console.error('Unable to read saved medications.', error);
      return {
        medications: [],
        storageReady: false,
        error: 'Saved medications could not be loaded. Your existing data has been left untouched.'
      };
    }
  });
  const [medications, setMedications] = useState(savedState.medications);
  const [form, setForm] = useState({
    name: '',
    dose: '',
    time: '',
    frequency: 'daily',
    notes: ''
  });
  const [storageReady] = useState(savedState.storageReady);
  const [storageError, setStorageError] = useState(savedState.error);

  const saveMedications = (nextMedications) => {
    setMedications(nextMedications);
    if (!storageReady) {
      setStorageError('Changes are only available until you leave this page because saved data could not be loaded.');
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMedications));
      setStorageError('');
    } catch (error) {
      console.error('Unable to save medications.', error);
      setStorageError('Changes could not be saved on this device. Check your browser storage settings.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleAddMedication = (event) => {
    event.preventDefault();
    const medication = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: form.name.trim(),
      dose: form.dose.trim(),
      time: form.frequency === 'daily' ? form.time : '',
      frequency: form.frequency,
      notes: form.notes.trim(),
      doseLog: []
    };

    if (!medication.name || !medication.dose) return;

    saveMedications([...medications, medication]);
    setForm({ name: '', dose: '', time: '', frequency: 'daily', notes: '' });
  };

  const handleLogDose = (medicationId) => {
    const today = TODAY_ON_LOAD;

    const nextMedications = medications.map((medication) => {
      if (medication.id !== medicationId) return medication;
      const doseLog = Array.isArray(medication.doseLog) ? medication.doseLog : [];

      if (medication.frequency === 'daily' && doseLog.some((dose) => dose.date === today)) {
        return medication;
      }

      return { ...medication, doseLog: [...doseLog, { date: today }] };
    });
    saveMedications(nextMedications);
  };

  const today = TODAY_ON_LOAD;

  return (
    <section
      id="medication-tracker"
      className="rounded-[28px] border border-[#EADFCF] bg-[#FFFDF9] shadow-xl p-6 sm:p-9 md:p-10"
      aria-labelledby="medication-tracker-title"
    >
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5F7C58]">Your care, in one place</p>
          <h3 id="medication-tracker-title" className="font-serif text-2xl font-bold text-[#45362F] sm:text-3xl">
            Medication tracker
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 max-w-lg">
          <p className="text-sm leading-relaxed text-[#705B51] flex-1">
            Keep your medication details and dose notes together. Follow the instructions from your healthcare professional.
          </p>
          <div className="self-end shrink-0">
            <FeatureTip tip="Record medication names and times accurately. Never start, stop, or change prescribed maternal medications or supplements without speaking with your doctor." />
          </div>
        </div>
      </div>

      {storageError && (
        <p role="alert" className="mb-5 rounded-xl border border-[#D98F96]/40 bg-[#FCECE5] px-4 py-3 text-sm text-[#80545A]">
          {storageError}
        </p>
      )}

      <form onSubmit={handleAddMedication} className="mb-8 rounded-2xl bg-[#F4F8F3] p-4 sm:p-6">
        <h4 className="mb-4 font-semibold text-[#45362F]">Add a medication</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-medium text-[#705B51]">
            Medication name
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Prenatal vitamin"
              className="mt-1.5 w-full rounded-xl border border-[#D9E3D6] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#7D9A75] focus:ring-2 focus:ring-[#A8BCA1]/30"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51]">
            Dose
            <input
              required
              name="dose"
              value={form.dose}
              onChange={handleChange}
              placeholder="e.g. 1 tablet"
              className="mt-1.5 w-full rounded-xl border border-[#D9E3D6] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#7D9A75] focus:ring-2 focus:ring-[#A8BCA1]/30"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51]">
            Schedule
            <ThemedDropdown
              id="medication-schedule"
              label="Schedule"
              value={form.frequency}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'as-needed', label: 'As needed' },
              ]}
              onChange={(frequency) => setForm((currentForm) => ({ ...currentForm, frequency }))}
            />
          </label>
          {form.frequency === 'daily' && (
            <label className="text-sm font-medium text-[#705B51]">
              Usual time
              <input
                type="time"
                required
                name="time"
                value={form.time}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-[#D9E3D6] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#7D9A75] focus:ring-2 focus:ring-[#A8BCA1]/30"
              />
            </label>
          )}
        </div>
        <label className="mt-4 block text-sm font-medium text-[#705B51]">
          Notes <span className="font-normal text-[#9E8B81]">(optional)</span>
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any personal notes"
            className="mt-1.5 w-full rounded-xl border border-[#D9E3D6] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#7D9A75] focus:ring-2 focus:ring-[#A8BCA1]/30"
          />
        </label>
        <button
          type="submit"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#5F7C58] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4D6947] focus:outline-none focus:ring-2 focus:ring-[#5F7C58] focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add medication
        </button>
      </form>

      <div className="space-y-3">
        {medications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D9E3D6] px-5 py-8 text-center">
            <p className="font-medium text-[#45362F]">No medications added yet</p>
            <p className="mt-1 text-sm text-[#705B51]">Add a medication above to start keeping track.</p>
          </div>
        ) : (
          medications.map((medication) => {
            const doseLog = Array.isArray(medication.doseLog) ? medication.doseLog : [];
            const dosesToday = doseLog.filter((dose) => dose.date === today);
            const dailyDoseTaken = medication.frequency === 'daily' && dosesToday.length > 0;

            return (
              <article key={medication.id} className="flex flex-col gap-4 rounded-2xl border border-[#EADFCF] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-[#45362F]">{medication.name}</h4>
                    <span className="rounded-full bg-[#EEF4EC] px-2.5 py-1 text-xs font-medium capitalize text-[#5F7C58]">
                      {medication.frequency === 'as-needed' ? 'As needed' : 'Daily'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#705B51]">
                    {medication.dose}
                    {medication.time && (
                      <span className="ml-3 inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        {medication.time}
                      </span>
                    )}
                  </p>
                  {medication.notes && <p className="mt-1 text-sm text-[#9E8B81]">{medication.notes}</p>}
                  <p className="mt-2 text-xs text-[#705B51]">
                    {dosesToday.length === 0
                      ? 'No doses logged today'
                      : `${dosesToday.length} ${dosesToday.length === 1 ? 'dose' : 'doses'} logged today`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLogDose(medication.id)}
                    disabled={dailyDoseTaken}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#A8BCA1] px-4 py-2 text-sm font-semibold text-[#4D6947] transition-colors hover:bg-[#EEF4EC] disabled:cursor-default disabled:border-[#D9E3D6] disabled:bg-[#F4F8F3] disabled:text-[#73866E]"
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                    {dailyDoseTaken ? 'Taken today' : 'Log dose'}
                  </button>
                  <button
                    type="button"
                    onClick={() => saveMedications(medications.filter((item) => item.id !== medication.id))}
                    aria-label={`Remove ${medication.name}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#9E8B81] transition-colors hover:bg-[#FCECE5] hover:text-[#A8535D] focus:outline-none focus:ring-2 focus:ring-[#D98F96]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-[#9E8B81]">
        This tracker is for personal organization only. It does not provide medication advice or replace guidance from your care team.
      </p>
    </section>
  );
}
