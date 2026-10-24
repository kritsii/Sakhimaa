/**
 * Safe localStorage wrapper for Dashboard Favourites and Profile Settings
 * 
 * Favourites are strictly partitioned by local demo user ID (`sakhimaa_favourites_${userId}`)
 * to ensure privacy and isolation between demo accounts.
 */

const CURRENT_USER_KEY = 'sakhimaa_current_user';
const USERS_STORAGE_KEY = 'sakhimaa_registered_users';

const getFavouritesStorageKey = (userId) => {
  const safeId = userId || 'anonymous_demo_user';
  return `sakhimaa_favourites_${safeId}`;
};

/**
 * Retrieve saved favourites for a given user
 */
export const getUserFavourites = (userId) => {
  if (typeof window === 'undefined') return [];
  const key = getFavouritesStorageKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading favourites from localStorage:', e);
    return [];
  }
};

/**
 * Save a thought/affirmation to user favourites
 * Prevents duplicates by thought ID
 */
export const saveUserFavourite = (userId, thought) => {
  if (typeof window === 'undefined' || !thought || !thought.id) return [];
  const key = getFavouritesStorageKey(userId);
  try {
    const currentList = getUserFavourites(userId);
    // Check if already saved
    if (currentList.some((item) => item.id === thought.id)) {
      return currentList;
    }

    const newFavourite = {
      id: thought.id,
      quote: thought.quote,
      supportingText: thought.supportingText || '',
      category: thought.category || 'Positive Thought',
      journey: thought.journey || 'both',
      savedAt: new Date().toISOString(),
    };

    const updated = [newFavourite, ...currentList];
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving favourite to localStorage:', e);
    return getUserFavourites(userId);
  }
};

/**
 * Remove a thought from user favourites
 */
export const removeUserFavourite = (userId, thoughtId) => {
  if (typeof window === 'undefined' || !thoughtId) return [];
  const key = getFavouritesStorageKey(userId);
  try {
    const currentList = getUserFavourites(userId);
    const updated = currentList.filter((item) => item.id !== thoughtId);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error removing favourite from localStorage:', e);
    return getUserFavourites(userId);
  }
};

/**
 * Check if a thought is already in user's favourites
 */
export const isUserFavourite = (userId, thoughtId) => {
  if (!thoughtId) return false;
  const list = getUserFavourites(userId);
  return list.some((item) => item.id === thoughtId);
};

/**
 * Update current user profile in localStorage (dueDate, deliveryDate, journey, etc.)
 * Syncs both sakhimaa_current_user and the registered users array.
 */
export const updateUserProfileStorage = (partialData) => {
  if (typeof window === 'undefined' || !partialData) return null;
  try {
    const rawCurrent = localStorage.getItem(CURRENT_USER_KEY);
    const current = rawCurrent ? JSON.parse(rawCurrent) : {};
    const updatedUser = { ...current, ...partialData };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Also update in registered users array if user has an id
    if (updatedUser.id) {
      const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (rawUsers) {
        const users = JSON.parse(rawUsers);
        const idx = users.findIndex((u) => u.id === updatedUser.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...partialData };
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      }
    }

    return updatedUser;
  } catch (e) {
    console.error('Error updating user profile in localStorage:', e);
    return null;
  }
};
