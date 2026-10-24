/**
 * Clinically appropriate pregnancy and postnatal duration calculator
 * 
 * Obstetric conventions:
 * - Standard full gestational period is 40 weeks (280 days) from LMP.
 * - Current gestational age = 40 weeks - remaining weeks until Estimated Due Date (EDD).
 * - Postnatal duration = elapsed time from actual delivery date.
 */

/**
 * Maps gestational week to pregnancy month (1-9)
 */
export const getPregnancyMonth = (week) => {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  if (week <= 13) return 3;
  if (week <= 17) return 4;
  if (week <= 22) return 5;
  if (week <= 27) return 6;
  if (week <= 31) return 7;
  if (week <= 35) return 8;
  return 9;
};

/**
 * Maps gestational week to pregnancy trimester
 */
export const getPregnancyTrimester = (week) => {
  if (week <= 13) return 'First Trimester';
  if (week <= 27) return 'Second Trimester';
  return 'Third Trimester';
};

/**
 * Calculates pregnancy progress from an Estimated Due Date (EDD)
 * @param {string|Date} dueDate - ISO date string or Date object
 * @returns {object} Pregnancy progress metadata or invalid state
 */
export const calculatePregnancyProgress = (dueDate) => {
  if (!dueDate) {
    return { isValid: false, reason: 'NO_DATE' };
  }

  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) {
    return { isValid: false, reason: 'INVALID_DATE' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  // Remaining days until due date
  const diffTime = due.getTime() - today.getTime();
  const remainingDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // Full pregnancy is standard 280 days (40 weeks)
  const completedDays = 280 - remainingDays;

  // Validate within plausible window (1 to 42 weeks)
  if (completedDays < 1 || completedDays > 300) {
    return { isValid: false, reason: 'OUT_OF_RANGE' };
  }

  const completedWeeks = Math.max(1, Math.min(42, Math.floor(completedDays / 7)));
  const daysInCurrentWeek = completedDays % 7;
  const month = getPregnancyMonth(completedWeeks);
  const trimester = getPregnancyTrimester(completedWeeks);

  return {
    isValid: true,
    weeks: completedWeeks,
    days: daysInCurrentWeek,
    month: month,
    trimester: trimester,
    remainingDays: Math.max(0, remainingDays),
    remainingWeeks: Math.max(0, Math.ceil(remainingDays / 7)),
    dueDateFormatted: due.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
};

/**
 * Calculates postnatal duration from a delivery date
 * @param {string|Date} deliveryDate - ISO date string or Date object
 * @returns {object} Postnatal progress metadata or invalid state
 */
export const calculatePostnatalProgress = (deliveryDate) => {
  if (!deliveryDate) {
    return { isValid: false, reason: 'NO_DATE' };
  }

  const delivered = new Date(deliveryDate);
  if (Number.isNaN(delivered.getTime())) {
    return { isValid: false, reason: 'INVALID_DATE' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  delivered.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - delivered.getTime();
  const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (elapsedDays < 0) {
    // Delivery date is in the future
    return { isValid: false, reason: 'FUTURE_DATE' };
  }

  const weeks = Math.floor(elapsedDays / 7);
  const days = elapsedDays % 7;
  const months = Math.floor(elapsedDays / 30.4375);

  let durationText = '';
  if (elapsedDays === 0) {
    durationText = 'Welcome to day one of your motherhood journey';
  } else if (elapsedDays < 7) {
    durationText = `You're ${elapsedDays} ${elapsedDays === 1 ? 'day' : 'days'} into your postnatal journey`;
  } else {
    durationText = `You're ${weeks} ${weeks === 1 ? 'week' : 'weeks'} into your postnatal journey`;
  }

  return {
    isValid: true,
    elapsedDays,
    weeks,
    days,
    months,
    durationText,
    deliveryDateFormatted: delivered.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };
};

/**
 * Helper to generate a dynamic demo due date based on desired weeks completed today
 * e.g., 24 weeks into pregnancy -> due date is in 16 weeks (112 days)
 */
export const createDynamicDueDate = (weeksPregnant = 24) => {
  const remainingWeeks = Math.max(0, 40 - weeksPregnant);
  const target = new Date();
  target.setDate(target.getDate() + remainingWeeks * 7);
  return target.toISOString().split('T')[0];
};

/**
 * Helper to generate a dynamic demo delivery date based on desired postpartum weeks
 * e.g., 3 weeks postpartum -> delivery was 21 days ago
 */
export const createDynamicDeliveryDate = (weeksPostpartum = 3) => {
  const target = new Date();
  target.setDate(target.getDate() - weeksPostpartum * 7);
  return target.toISOString().split('T')[0];
};
