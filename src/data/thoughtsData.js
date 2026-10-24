/**
 * Curated Thoughts, Gentle Affirmations, and Universal Prayers
 * for "A Little Moment for You"
 * 
 * Tailored by journey stage (pregnant, postnatal, or universal comfort).
 */

export const THOUGHTS_DATA = [
  // ================= PREGNANCY FOCUS =================
  {
    id: 'thought-p1',
    category: 'Positive Thought',
    journey: 'pregnant',
    quote: "You don't have to be perfect to be a wonderful mother. One day at a time is enough.",
    supportingText: "Your body is already doing miraculous work. Give yourself gentle grace today.",
  },
  {
    id: 'thought-p2',
    category: 'Gentle Affirmation',
    journey: 'pregnant',
    quote: "My body is strong, wise, and creating life with quiet beauty.",
    supportingText: "Trust in the timing and rhythm of your journey. You are already a protector.",
  },
  {
    id: 'thought-p3',
    category: 'Prayer & Reflection',
    journey: 'pregnant',
    quote: "May I find patience in difficult moments, strength when I need it, and peace in the quiet changes.",
    supportingText: "Sending gentle blessings of calm and safety to you and your little one.",
  },
  {
    id: 'thought-p4',
    category: 'Positive Thought',
    journey: 'pregnant',
    quote: "It's okay to feel overwhelmed by uncertainty. Every feeling you have deserves compassion.",
    supportingText: "You are navigating profound transformation. Be as tender with yourself as you will be with your child.",
  },
  {
    id: 'thought-p5',
    category: 'Gentle Affirmation',
    journey: 'pregnant',
    quote: "I can pause, breathe, and rest without guilt whenever I need to.",
    supportingText: "Resting is not doing nothing; it is nurturing the life blooming inside you.",
  },
  {
    id: 'thought-p6',
    category: 'Prayer & Reflection',
    journey: 'pregnant',
    quote: "May this growing life be cradled in health, love, and unwavering protection.",
    supportingText: "A wish for deep tranquility, sound sleep, and comforting ease.",
  },
  {
    id: 'thought-p7',
    category: 'Positive Thought',
    journey: 'pregnant',
    quote: "Your journey is unique, and you deserve kindness at every single step.",
    supportingText: "Do not compare your path with anyone else's. Your story is sacred and yours alone.",
  },

  // ================= POSTNATAL FOCUS =================
  {
    id: 'thought-post1',
    category: 'Positive Thought',
    journey: 'postnatal',
    quote: "It's okay to rest. You don't have to do everything today.",
    supportingText: "Your recovery matters just as much as caring for your little one.",
  },
  {
    id: 'thought-post2',
    category: 'Gentle Affirmation',
    journey: 'postnatal',
    quote: "I deserve rest, support, and kindness from those around me.",
    supportingText: "Asking for a hand is a sign of strength, wisdom, and deep care for your family.",
  },
  {
    id: 'thought-post3',
    category: 'Prayer & Reflection',
    journey: 'postnatal',
    quote: "May this home be filled with peace, kindness, patience, and gentle healing.",
    supportingText: "May quiet grace fill your days and quiet strength sustain your nights.",
  },
  {
    id: 'thought-post4',
    category: 'Gentle Affirmation',
    journey: 'postnatal',
    quote: "I can ask for help when I need it, and receive it with an open heart.",
    supportingText: "You were never meant to walk this path alone. Allow your community to wrap around you.",
  },
  {
    id: 'thought-post5',
    category: 'Positive Thought',
    journey: 'postnatal',
    quote: "My wellbeing matters, too. I cannot pour from an empty cup.",
    supportingText: "Taking ten minutes for yourself is an act of love for your entire family.",
  },
  {
    id: 'thought-post6',
    category: 'Prayer & Reflection',
    journey: 'postnatal',
    quote: "May I find comfort in hope, resilience in tiredness, and boundless love in the little moments.",
    supportingText: "Every newborn cuddle and every quiet breath is a testament to your devotion.",
  },
  {
    id: 'thought-post7',
    category: 'Positive Thought',
    journey: 'postnatal',
    quote: "Motherhood is learned minute by minute. You are already everything your baby needs.",
    supportingText: "Trust your maternal instinct. There is no manual, only love and presence.",
  },

  // ================= UNIVERSAL HARMONY =================
  {
    id: 'thought-u1',
    category: 'Positive Thought',
    journey: 'both',
    quote: "Breathe in peace, exhale tension. Right here, in this present second, you are safe.",
    supportingText: "Allow your shoulders to soften and unclench your jaw. You are doing wonderfully.",
  },
  {
    id: 'thought-u2',
    category: 'Gentle Affirmation',
    journey: 'both',
    quote: "I honor the wisdom of my body and honor every season of change.",
    supportingText: "Change is not a loss of who you were, but an expansion of who you are becoming.",
  },
  {
    id: 'thought-u3',
    category: 'Prayer & Reflection',
    journey: 'both',
    quote: "May light surround you, peace dwell within you, and warm kindness guide your steps.",
    supportingText: "May every morning bring gentle renewal and every evening bring tranquil rest.",
  },
];

/**
 * Filter thoughts relevant to user's journey
 */
export const getThoughtsForJourney = (journey = 'pregnant') => {
  const normalized = (journey || 'pregnant').toLowerCase();
  const prioritized = THOUGHTS_DATA.filter(
    (t) => t.journey === normalized || t.journey === 'both'
  );
  return prioritized.length > 0 ? prioritized : THOUGHTS_DATA;
};
