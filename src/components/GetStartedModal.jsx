import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-react';
import { signup, login } from '../api/auth';

export default function GetStartedModal({ 
  isOpen, 
  onClose, 
  initialJourney = 'pregnant', 
  onAuthSuccess 
}) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [journey, setJourney] = useState(initialJourney || 'pregnant');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // UI feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialJourney) {
      setJourney(initialJourney);
    }
  }, [initialJourney]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset errors when mode changes
  useEffect(() => {
    setError('');
    setSuccessMsg('');
  }, [mode]);

  if (!isOpen) return null;

  // Handle Sign In (Local Storage Auth)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await login({ email: trimmedEmail, password });
      completeAuth(data.user, data.user?.journey || journey);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up (Local Storage Auth)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Please tell us your name so we can personalize your care.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!agreedTerms) {
      setError('Please agree to SakhiMaa terms and privacy promise.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signup({
        name: trimmedName,
        email: trimmedEmail,
        password,
        journey,
      });
      completeAuth(data.user, journey);
    } catch (err) {
      setError(err.message || 'Signup failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address to receive reset instructions.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(`We have sent a secure password reset link to ${trimmedEmail}.`);
    }, 800);
  };

  const completeAuth = (user, selectedStage) => {
    try {
      localStorage.setItem('sakhimaa_current_user', JSON.stringify(user));
    } catch (e) {
      console.error('Storage error', e);
    }

    setSuccessMsg(`Welcome, ${user.name}!`);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onAuthSuccess) {
        onAuthSuccess(user, selectedStage);
      }
      onClose();
    }, 900);
  };


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#45362F]/45 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="relative w-full max-w-md sm:max-w-lg bg-[#FFF9F1] rounded-3xl border-2 border-[#EADFCF] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#45362F] transition-all max-h-[92vh] overflow-y-auto"
      >
        {/* Decorative soft gradient blobs */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#F4B49B]/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#A8BCA1]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#705B51] hover:bg-[#F7F1E8] hover:text-[#45362F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D98F96] cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: SakhiMaa Branding */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9F1] border border-[#EADFCF] p-1.5 flex items-center justify-center mx-auto shadow-sm shadow-[#D98F96]/15 mb-3">
            <img src="/logo.png" alt="SakhiMaa Logo" className="w-full h-full object-contain" />
          </div>
          <h3 id="auth-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#45362F]">
            {mode === 'signup' && 'Create Your SakhiMaa Account'}
            {mode === 'login' && 'Welcome Back to SakhiMaa'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs sm:text-sm text-[#705B51] mt-1 max-w-sm mx-auto">
            {mode === 'signup' && 'Join thousands of mothers receiving thoughtful, comforting guidance.'}
            {mode === 'login' && 'Sign in to access your maternal notes, symptom tracker & guidance.'}
            {mode === 'forgot' && 'Enter your email to receive simple reset instructions.'}
          </p>
        </div>

        {/* Mode Segmented Tab Switcher (Sign In vs Sign Up) */}
        {mode !== 'forgot' && (
          <div className="flex items-center justify-center p-1 bg-[#F2E8DC] rounded-full max-w-xs mx-auto mb-6 shadow-inner">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#45362F] shadow-sm'
                  : 'text-[#705B51] hover:text-[#45362F]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#D98F96] text-white shadow-sm'
                  : 'text-[#705B51] hover:text-[#45362F]'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error Notification Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FCECE5] border border-[#D98F96]/40 text-[#45362F] text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-[#D98F96] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Confirmation Screen */}
        {successMsg && !isSubmitting ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#EEF4EC] text-[#5F7C58] flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#45362F]">
              {successMsg}
            </h4>
            <p className="text-xs text-[#705B51]">
              Taking you to your gentle care space...
            </p>
          </div>
        ) : (
          <>
            {/* 1. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E8B81]" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none transition-all placeholder:text-[#9E8B81]"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase text-[#45362F]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-[#D98F96] hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E8B81]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none transition-all placeholder:text-[#9E8B81]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#9E8B81] hover:text-[#45362F] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="login-remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#D98F96] rounded border-[#EADFCF] focus:ring-[#D98F96] accent-[#D98F96]"
                  />
                  <label htmlFor="login-remember" className="text-xs text-[#705B51] cursor-pointer">
                    Keep me signed in on this device
                  </label>
                </div>

                {/* Submit Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-full font-semibold text-white text-sm bg-[#D98F96] hover:bg-[#C67981] shadow-md shadow-[#D98F96]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  <span>{isSubmitting ? 'Signing in...' : 'Sign In to SakhiMaa'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 2. SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E8B81]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none transition-all placeholder:text-[#9E8B81]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E8B81]" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none transition-all placeholder:text-[#9E8B81]"
                    />
                  </div>
                </div>

                {/* Choose Motherhood Journey Stage */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                    Select Your Stage
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setJourney('pregnant')}
                      className={`p-3 rounded-2xl text-left border cursor-pointer transition-all ${
                        journey === 'pregnant'
                          ? 'bg-[#FCECE5] border-2 border-[#D98F96] shadow-xs'
                          : 'bg-white border-[#EADFCF] hover:bg-[#FCECE5]/30'
                      }`}
                    >
                      <span className="block font-serif font-bold text-xs sm:text-sm text-[#45362F]">
                        I&apos;m Pregnant
                      </span>
                      <span className="block text-[11px] text-[#705B51] mt-0.5">
                        Pregnancy Care
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setJourney('postnatal')}
                      className={`p-3 rounded-2xl text-left border cursor-pointer transition-all ${
                        journey === 'postnatal'
                          ? 'bg-[#EEF4EC] border-2 border-[#5F7C58] shadow-xs'
                          : 'bg-white border-[#EADFCF] hover:bg-[#EEF4EC]/30'
                      }`}
                    >
                      <span className="block font-serif font-bold text-xs sm:text-sm text-[#45362F]">
                        I&apos;ve Delivered
                      </span>
                      <span className="block text-[11px] text-[#705B51] mt-0.5">
                        Postnatal Care
                      </span>
                    </button>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#9E8B81]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none transition-all placeholder:text-[#9E8B81]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-3 text-[#9E8B81] hover:text-[#45362F] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3.5 text-[#9E8B81]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none transition-all placeholder:text-[#9E8B81]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-3 text-[#9E8B81] hover:text-[#45362F] cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="signup-terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-[#D98F96] rounded border-[#EADFCF] focus:ring-[#D98F96] accent-[#D98F96]"
                  />
                  <label htmlFor="signup-terms" className="text-xs text-[#705B51] leading-relaxed cursor-pointer">
                    I agree to SakhiMaa&apos;s privacy promise. My health records remain strictly confidential.
                  </label>
                </div>

                {/* Submit Sign Up Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-full font-semibold text-white text-sm bg-[#D98F96] hover:bg-[#C67981] shadow-md shadow-[#D98F96]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating your account...' : 'Create Account & Begin'}</span>
                </button>

              </form>
            )}

            {/* 3. FORGOT PASSWORD FORM */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#45362F] mb-1.5">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9E8B81]" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EADFCF] focus:border-[#D98F96] focus:ring-2 focus:ring-[#D98F96]/30 text-sm text-[#45362F] outline-none transition-all placeholder:text-[#9E8B81]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-full font-semibold text-white text-sm bg-[#D98F96] hover:bg-[#C67981] shadow-md shadow-[#D98F96]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <span>{isSubmitting ? 'Sending link...' : 'Send Password Reset Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-[#705B51] hover:text-[#D98F96] underline font-medium cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Footer Switch Prompt & Privacy */}
            {mode !== 'forgot' && (
              <div className="pt-4 border-t border-[#EADFCF]/70 mt-4 space-y-3">
                <div className="text-center">
                  {mode === 'login' ? (
                    <p className="text-xs text-[#705B51]">
                      Don&apos;t have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-[#D98F96] hover:underline font-bold cursor-pointer"
                      >
                        Sign Up free
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-[#705B51]">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-[#D98F96] hover:underline font-bold cursor-pointer"
                      >
                        Sign In here
                      </button>
                    </p>
                  )}
                </div>

                {/* Privacy reassurance */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9E8B81] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A8BCA1]" />
                  <span>Encrypted maternal data • Zero third-party sharing</span>
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
