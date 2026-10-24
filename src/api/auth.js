// Client-side authentication store using localStorage
// Zero setup required: works completely in the browser without any backend or database!

const USERS_STORAGE_KEY = 'sakhimaa_registered_users';
const CURRENT_USER_KEY = 'sakhimaa_current_user';
const TOKEN_KEY = 'sakhimaa_auth_token';

// Default starter user for easy testing
// Calculated so Ananya is dynamically 24 weeks pregnant today (16 weeks until due date)
const DEFAULT_DUE_DATE = new Date(Date.now() + 112 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const DEFAULT_USERS = [
  {
    id: 'user_default_1',
    name: 'Ananya Sharma',
    email: 'ananya@example.com',
    password: 'password123',
    journey: 'pregnant',
    dueDate: DEFAULT_DUE_DATE,
    createdAt: new Date().toISOString(),
  },
];

// Helper to get stored users list
const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading registered users from localStorage:', e);
    return DEFAULT_USERS;
  }
};

// Helper to save users list
const saveRegisteredUsers = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving registered users to localStorage:', e);
  }
};

/**
 * Sign up a new user using localStorage
 */
export const signup = async ({ name, email, password, journey = 'pregnant' }) => {
  // Small delay to simulate realistic smooth UI feedback
  await new Promise((resolve) => setTimeout(resolve, 400));

  const trimmedName = name ? name.trim() : '';
  const trimmedEmail = email ? email.trim().toLowerCase() : '';

  if (!trimmedName) {
    throw new Error('Please provide your name.');
  }
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const users = getRegisteredUsers();
  const existingUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

  if (existingUser) {
    throw new Error('An account with this email already exists. Please Sign In instead.');
  }

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: trimmedName,
    email: trimmedEmail,
    password: password, // Stored safely in client's own browser storage
    journey: journey,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  // Set active user session
  const safeUserData = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    journey: newUser.journey,
    dueDate: newUser.dueDate || null,
    deliveryDate: newUser.deliveryDate || null,
    createdAt: newUser.createdAt,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUserData));
  localStorage.setItem(TOKEN_KEY, `local_token_${newUser.id}`);

  return {
    success: true,
    message: 'Account created successfully!',
    user: safeUserData,
    token: `local_token_${newUser.id}`,
  };
};

/**
 * Log in an existing user using localStorage
 */
export const login = async ({ email, password }) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const trimmedEmail = email ? email.trim().toLowerCase() : '';

  if (!trimmedEmail || !password) {
    throw new Error('Please enter both email and password.');
  }

  const users = getRegisteredUsers();
  const foundUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

  if (!foundUser) {
    throw new Error('No account found with this email. Please check your spelling or click Sign Up.');
  }

  if (foundUser.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  const safeUserData = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    journey: foundUser.journey,
    dueDate: foundUser.dueDate || null,
    deliveryDate: foundUser.deliveryDate || null,
    createdAt: foundUser.createdAt,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUserData));
  localStorage.setItem(TOKEN_KEY, `local_token_${foundUser.id}`);

  return {
    success: true,
    message: 'Logged in successfully!',
    user: safeUserData,
    token: `local_token_${foundUser.id}`,
  };
};

/**
 * Get currently authenticated user from localStorage
 */
export const getMe = async () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Log out and clear user session
 */
export const logout = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Logout error:', e);
  }
};
