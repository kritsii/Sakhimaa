/**
 * Centralized Route Constants for SakhiMaa Dashboard
 * 
 * These constants decouple the dashboard card presentations from their destination routes,
 * allowing teammate-developed feature pages to be easily plugged in or remapped.
 */

export const DASHBOARD_ROUTES = {
  // Main Dashboard Views
  DASHBOARD_OVERVIEW: '/dashboard',
  MY_FAVOURITES: '/dashboard/favourites',

  // Pregnancy Healthcare Features
  PREGNANCY_SYMPTOMS: '/pregnancy/symptom-tracker',
  PREGNANCY_REPORTS: '/pregnancy/health-reports',
  PREGNANCY_MEDICATIONS: '/pregnancy/medications',
  PREGNANCY_APPOINTMENTS: '/pregnancy/appointments',
  PREGNANCY_GUIDE: '/pregnancy/week-by-week-guide',
  YOGA_GUIDE: '/wellness/yoga-and-asanas',

  // Postnatal Healthcare Features
  POSTNATAL_RECOVERY: '/postnatal/recovery-tracker',
  POSTNATAL_REPORTS: '/postnatal/health-reports',
  POSTNATAL_MEDICATIONS: '/postnatal/medications',
  BREASTFEEDING: '/postnatal/breastfeeding-support',
  NEWBORN_CARE: '/postnatal/newborn-care',
};

/**
 * Feature card definitions for Pregnancy Journey
 */
export const PREGNANCY_FEATURE_CARDS = [
  {
    id: 'pregnancy-symptoms',
    routeConstant: 'PREGNANCY_SYMPTOMS',
    path: DASHBOARD_ROUTES.PREGNANCY_SYMPTOMS,
    title: 'Pregnancy Symptom Tracker',
    description: 'Record symptoms, follow changes over time, and learn when to seek medical advice.',
    iconName: 'HeartPulse',
    accent: 'coral',
    category: 'Daily Health',
  },
  {
    id: 'pregnancy-reports',
    routeConstant: 'PREGNANCY_REPORTS',
    path: DASHBOARD_ROUTES.PREGNANCY_REPORTS,
    title: 'Pregnancy Health Report Analysis',
    description: 'Make your health records easier to understand and prepare for doctor visits.',
    iconName: 'FileText',
    accent: 'teal',
    category: 'Clinical Insights',
  },
  {
    id: 'pregnancy-medications',
    routeConstant: 'PREGNANCY_MEDICATIONS',
    path: DASHBOARD_ROUTES.PREGNANCY_MEDICATIONS,
    title: 'Medication Tracker',
    description: 'Keep prescribed medicines, supplements, and reminders organised.',
    iconName: 'Pill',
    accent: 'peach',
    category: 'Care Routine',
  },
  {
    id: 'pregnancy-appointments',
    routeConstant: 'PREGNANCY_APPOINTMENTS',
    path: DASHBOARD_ROUTES.PREGNANCY_APPOINTMENTS,
    title: 'Antenatal Appointment Planner',
    description: 'Keep track of upcoming checkups, tests, and important appointments.',
    iconName: 'CalendarHeart',
    accent: 'sage',
    category: 'Planning & Care',
  },
  {
    id: 'pregnancy-guide',
    routeConstant: 'PREGNANCY_GUIDE',
    path: DASHBOARD_ROUTES.PREGNANCY_GUIDE,
    title: 'Pregnancy Week & Health Guide',
    description: 'Explore helpful health information relevant to your stage of pregnancy.',
    iconName: 'BookOpen',
    accent: 'teal',
    category: 'Guidance',
  },
  {
    id: 'yoga-guide-pregnant',
    routeConstant: 'YOGA_GUIDE',
    path: DASHBOARD_ROUTES.YOGA_GUIDE,
    title: 'Prenatal Yoga & Asanas',
    description: 'Explore helpful yoga asanas relevant to your stage of pregnancy.',
    iconName: 'Activity',
    accent: 'lavender',
    category: 'Gentle Movement',
  },
];

/**
 * Feature card definitions for Postnatal Journey
 */
export const POSTNATAL_FEATURE_CARDS = [
  {
    id: 'postnatal-recovery',
    routeConstant: 'POSTNATAL_RECOVERY',
    path: DASHBOARD_ROUTES.POSTNATAL_RECOVERY,
    title: "Mother's Recovery & Symptom Tracker",
    description: 'Track recovery symptoms and recognise changes that may need medical attention.',
    iconName: 'HeartPulse',
    accent: 'coral',
    category: 'Maternal Healing',
  },
  {
    id: 'postnatal-reports',
    routeConstant: 'POSTNATAL_REPORTS',
    path: DASHBOARD_ROUTES.POSTNATAL_REPORTS,
    title: 'Postnatal Health Report Analysis',
    description: 'Organise health information and prepare summaries for consultations.',
    iconName: 'FileText',
    accent: 'teal',
    category: 'Clinical Records',
  },
  {
    id: 'postnatal-medications',
    routeConstant: 'POSTNATAL_MEDICATIONS',
    path: DASHBOARD_ROUTES.POSTNATAL_MEDICATIONS,
    title: 'Medication Tracker',
    description: 'Manage reminders for prescribed medicines and record doses taken.',
    iconName: 'Pill',
    accent: 'peach',
    category: 'Care Routine',
  },
  {
    id: 'breastfeeding-support',
    routeConstant: 'BREASTFEEDING',
    path: DASHBOARD_ROUTES.BREASTFEEDING,
    title: 'Breastfeeding Support',
    description: 'Explore feeding guidance, log sessions, and learn when to seek extra support.',
    iconName: 'Heart',
    accent: 'coral',
    category: 'Nourishment',
  },
  {
    id: 'newborn-care',
    routeConstant: 'NEWBORN_CARE',
    path: DASHBOARD_ROUTES.NEWBORN_CARE,
    title: 'Newborn Care',
    description: 'Keep feeding, diaper changes, appointments, and health observations organised.',
    iconName: 'Baby',
    accent: 'sage',
    category: 'Baby Wellbeing',
  },
  {
    id: 'yoga-guide-postnatal',
    routeConstant: 'YOGA_GUIDE',
    path: DASHBOARD_ROUTES.YOGA_GUIDE,
    title: 'Postnatal Yoga & Gentle Asanas',
    description: 'Explore gentle yoga asanas relevant to your stage of postpartum recovery.',
    iconName: 'Activity',
    accent: 'lavender',
    category: 'Gentle Recovery',
  },
];
