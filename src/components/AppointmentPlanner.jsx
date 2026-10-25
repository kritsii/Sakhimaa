import React, { useState } from 'react';
import {
  ArrowLeft,
  CalendarHeart,
  Check,
  CircleCheck,
  ClipboardList,
  Info,
  Plus,
  Trash2,
} from 'lucide-react';
import ThemedDropdown from './ThemedDropdown';

const APPOINTMENT_TYPES = [
  { value: 'checkup', label: 'Routine checkup' },
  { value: 'ultrasound', label: 'Ultrasound or scan' },
  { value: 'test', label: 'Lab test or screening' },
  { value: 'consultation', label: 'Specialist consultation' },
  { value: 'other', label: 'Other' },
];

const getStorageKey = (userId) => `sakhimaa-antenatal-appointments-${userId || 'guest'}`;

function getLocalDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function readAppointments(userId) {
  const saved = window.localStorage.getItem(getStorageKey(userId));
  if (!saved) return [];

  const appointments = JSON.parse(saved);
  const validTypes = APPOINTMENT_TYPES.map((type) => type.value);
  if (!Array.isArray(appointments) || appointments.some((appointment) =>
    !appointment || typeof appointment.id !== 'string'
    || typeof appointment.title !== 'string' || !appointment.title.trim()
    || typeof appointment.dateTime !== 'string' || Number.isNaN(Date.parse(appointment.dateTime))
    || !validTypes.includes(appointment.type)
    || typeof appointment.provider !== 'string' || typeof appointment.notes !== 'string'
    || typeof appointment.completed !== 'boolean'
  )) {
    throw new Error('Saved appointment data is not in the expected format.');
  }

  return appointments;
}

function getAppointmentTypeLabel(type) {
  return APPOINTMENT_TYPES.find((option) => option.value === type)?.label || 'Appointment';
}

export default function AppointmentPlanner({ userId, onBackToDashboard }) {
  const [savedState] = useState(() => {
    try {
      return { appointments: readAppointments(userId), storageReady: true, error: '' };
    } catch (error) {
      console.error('Unable to read saved antenatal appointments.', error);
      return {
        appointments: [],
        storageReady: false,
        error: 'Saved appointment data could not be loaded. Existing data has been left untouched.',
      };
    }
  });
  const [appointments, setAppointments] = useState(savedState.appointments);
  const [storageError, setStorageError] = useState(savedState.error);
  const [currentTime] = useState(() => Date.now());
  const [form, setForm] = useState({
    title: '',
    type: 'checkup',
    dateTime: getLocalDateTime(),
    provider: '',
    notes: '',
  });

  const saveAppointments = (nextAppointments) => {
    setAppointments(nextAppointments);
    if (!savedState.storageReady) {
      setStorageError('Changes are only available until you leave this page because saved data could not be loaded.');
      return;
    }

    try {
      window.localStorage.setItem(getStorageKey(userId), JSON.stringify(nextAppointments));
      setStorageError('');
    } catch (error) {
      console.error('Unable to save antenatal appointments.', error);
      setStorageError('Changes could not be saved on this device. Check your browser storage settings.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const dateTime = new Date(form.dateTime);
    if (!title) return;
    if (Number.isNaN(dateTime.getTime())) {
      setStorageError('Choose a valid date and time for this appointment.');
      return;
    }

    const appointment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      type: form.type,
      dateTime: dateTime.toISOString(),
      provider: form.provider.trim(),
      notes: form.notes.trim(),
      completed: false,
    };

    saveAppointments([...appointments, appointment].sort((a, b) => Date.parse(a.dateTime) - Date.parse(b.dateTime)));
    setForm({
      title: '',
      type: 'checkup',
      dateTime: getLocalDateTime(),
      provider: '',
      notes: '',
    });
  };

  const toggleCompleted = (appointmentId) => {
    saveAppointments(appointments.map((appointment) => (
      appointment.id === appointmentId
        ? { ...appointment, completed: !appointment.completed }
        : appointment
    )));
  };

  const upcomingAppointments = appointments.filter((appointment) => !appointment.completed && Date.parse(appointment.dateTime) >= currentTime);
  const pastAppointments = appointments.filter((appointment) => appointment.completed || Date.parse(appointment.dateTime) < currentTime);

  const renderAppointment = (appointment) => (
    <article key={appointment.id} className="flex flex-col gap-4 rounded-2xl border border-[#EADFCF] bg-[#FFFDF9] p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-[#45362F]">{appointment.title}</h3>
          <span className="rounded-full bg-[#EEF4EC] px-2.5 py-1 text-xs font-medium text-[#4D6947]">
            {getAppointmentTypeLabel(appointment.type)}
          </span>
          {appointment.completed && (
            <span className="rounded-full bg-[#F2E8DC] px-2.5 py-1 text-xs font-medium text-[#705B51]">Completed</span>
          )}
        </div>
        <time className="mt-2 block text-sm text-[#705B51]" dateTime={appointment.dateTime}>
          {new Date(appointment.dateTime).toLocaleString()}
        </time>
        {appointment.provider && <p className="mt-1 text-sm text-[#705B51]">{appointment.provider}</p>}
        {appointment.notes && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#9E8B81]">{appointment.notes}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
        <button
          type="button"
          onClick={() => toggleCompleted(appointment.id)}
          aria-label={`${appointment.completed ? 'Reopen' : 'Mark'} ${appointment.title} ${appointment.completed ? 'appointment' : 'as completed'}`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#A8BCA1] px-3.5 py-2 text-sm font-semibold text-[#4D6947] transition-colors hover:bg-[#EEF4EC] focus:outline-none focus:ring-2 focus:ring-[#5F7C58] cursor-pointer"
        >
          {appointment.completed ? <CircleCheck className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
          {appointment.completed ? 'Completed' : 'Mark done'}
        </button>
        <button
          type="button"
          onClick={() => saveAppointments(appointments.filter((item) => item.id !== appointment.id))}
          aria-label={`Remove ${appointment.title} appointment`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#9E8B81] transition-colors hover:bg-[#FCECE5] hover:text-[#A8535D] focus:outline-none focus:ring-2 focus:ring-[#D98F96] cursor-pointer"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 border-b border-[#EADFCF] pb-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 rounded-full border border-[#EADFCF] bg-white px-4 py-2 text-sm font-semibold text-[#45362F] shadow-xs transition-colors hover:border-[#559C91] hover:text-[#559C91] focus:outline-none focus:ring-2 focus:ring-[#559C91] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </button>
        <span className="rounded-full border border-[#5F7C58]/30 bg-[#EEF4EC] px-3 py-1 text-xs font-semibold text-[#4D6947]">
          Pregnancy care
        </span>
      </div>

      <section className="rounded-3xl border border-[#EADFCF] bg-gradient-to-br from-[#FFF9F1] via-[#FFFBF6] to-[#EEF4EC] p-6 shadow-xs sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4EC] text-[#5F7C58]">
            <CalendarHeart className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#5F7C58]">Feel prepared for your care visits</p>
            <h1 className="font-serif text-3xl font-bold text-[#45362F] sm:text-4xl">Antenatal appointment planner</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-[#705B51]">
              Keep upcoming checkups, scans, tests, and questions together in one place.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#EADFCF] bg-white/80 p-4 text-sm leading-relaxed text-[#705B51]">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#8667A0]" aria-hidden="true" />
          <p>This planner stores personal reminders in this browser. It does not send notifications or book appointments. Follow the schedule and advice from your maternity care team.</p>
        </div>
      </section>

      <section aria-labelledby="appointment-guide-title" className="rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-xs sm:p-7">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#D98F96]" aria-hidden="true" />
          <h2 id="appointment-guide-title" className="font-serif text-2xl font-bold text-[#45362F]">A little preparation can help</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            'Write down questions, new symptoms, or changes you would like to discuss.',
            'Bring any records or information your care team has asked you to bring.',
            'Confirm the appointment time, location, and any instructions directly with the clinic.',
            'Ask your care team when to expect results and whom to contact with follow-up questions.',
          ].map((tip) => (
            <li key={tip} className="rounded-2xl bg-[#F7F1E8] p-4 text-sm leading-relaxed text-[#705B51]">{tip}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="add-appointment-title" className="rounded-3xl border border-[#EADFCF] bg-[#FFFDF9] p-5 shadow-xs sm:p-7">
        <h2 id="add-appointment-title" className="mb-5 font-serif text-2xl font-bold text-[#45362F]">Add an appointment</h2>
        {storageError && (
          <p role="alert" className="mb-5 rounded-xl border border-[#D98F96]/40 bg-[#FCECE5] px-4 py-3 text-sm text-[#80545A]">{storageError}</p>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-[#705B51]">
            Appointment name
            <input
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="e.g. Midwife checkup"
              className="mt-1.5 w-full rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#5F7C58] focus:ring-2 focus:ring-[#A8BCA1]/30"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51]">
            Appointment type
            <ThemedDropdown
              id="antenatal-appointment-type"
              label="Appointment type"
              value={form.type}
              options={APPOINTMENT_TYPES}
              onChange={(type) => setForm((current) => ({ ...current, type }))}
            />
          </label>
          <label className="text-sm font-medium text-[#705B51]">
            Date and time
            <input
              required
              type="datetime-local"
              value={form.dateTime}
              onChange={(event) => setForm((current) => ({ ...current, dateTime: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#5F7C58] focus:ring-2 focus:ring-[#A8BCA1]/30"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51]">
            Clinic or provider <span className="font-normal text-[#9E8B81]">(optional)</span>
            <input
              value={form.provider}
              onChange={(event) => setForm((current) => ({ ...current, provider: event.target.value }))}
              placeholder="Add a name or location"
              className="mt-1.5 w-full rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#5F7C58] focus:ring-2 focus:ring-[#A8BCA1]/30"
            />
          </label>
          <label className="text-sm font-medium text-[#705B51] sm:col-span-2">
            Notes or questions <span className="font-normal text-[#9E8B81]">(optional)</span>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Questions to ask, items to bring, or other reminders"
              className="mt-1.5 w-full resize-y rounded-xl border border-[#EADFCF] bg-white px-3.5 py-2.5 text-[#45362F] outline-none focus:border-[#5F7C58] focus:ring-2 focus:ring-[#A8BCA1]/30"
            />
          </label>
          <button type="submit" className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#5F7C58] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4D6947] focus:outline-none focus:ring-2 focus:ring-[#5F7C58] focus:ring-offset-2 cursor-pointer">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Save appointment
          </button>
        </form>
      </section>

      <section aria-labelledby="upcoming-appointments-title" className="space-y-3">
        <h2 id="upcoming-appointments-title" className="font-serif text-2xl font-bold text-[#45362F]">Upcoming appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EADFCF] bg-[#FFFDF9] px-5 py-8 text-center">
            <p className="font-medium text-[#45362F]">No upcoming appointments saved</p>
            <p className="mt-1 text-sm text-[#705B51]">Add a reminder above when you are ready.</p>
          </div>
        ) : upcomingAppointments.map(renderAppointment)}
      </section>

      {pastAppointments.length > 0 && (
        <section aria-labelledby="past-appointments-title" className="space-y-3">
          <h2 id="past-appointments-title" className="font-serif text-2xl font-bold text-[#45362F]">Past appointments</h2>
          {pastAppointments.map(renderAppointment)}
        </section>
      )}
      <p className="text-xs leading-relaxed text-[#9E8B81]">Appointments are saved in this browser on this device under your account. This planner does not replace clinic reminders or your care team’s instructions.</p>
    </div>
  );
}
