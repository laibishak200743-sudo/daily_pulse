import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ArrowRight,
  Loader2,
  CheckCircle2,
  X,
} from 'lucide-react';

import ReCAPTCHA from 'react-google-recaptcha';

import type { User as FirebaseUser } from 'firebase/auth';

import { useAuth } from '../contexts/AuthContext';

import type { Language } from '../types';

type AuthMode =
  | 'login'
  | 'register'
  | 'verification';

interface AuthScreenProps {
  language?: Language;
  modal?: boolean;
  onClose?: () => void;
  onSuccess?: (
    user?: FirebaseUser
  ) => void;
  initialMode?: AuthMode;
}

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ??
  '6LfrLNAtAAAAAM0ZAd69Il8I5RAH5Ib_4Epszj6m';

export function AuthScreen({
  modal = false,
  onClose,
  onSuccess,
  initialMode = 'login',
}: AuthScreenProps) {
  const {
    user,
    login,
    register,
    continueAsGuest,
    logout,
    sendVerificationEmail,
    refreshVerification,
    getErrorMessage,
  } = useAuth();

  const [mode, setMode] =
    useState<AuthMode>(initialMode);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [displayName, setDisplayName] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [verificationChecking, setVerificationChecking] =
    useState(false);

  const [captchaToken, setCaptchaToken] =
    useState<string | null>(null);

  useEffect(() => {
    if (user && !user.emailVerified) {
      setMode('verification');
    }
  }, [user]);

  useEffect(() => {
    setError('');
    setSuccess('');
    setCaptchaToken(null);
  }, [mode]);

  const handleCaptchaChange = (
    token: string | null
  ) => {
    setCaptchaToken(token);

    if (token) {
      setError('');
    }
  };

  const requireCaptcha = (): boolean => {
    if (!captchaToken) {
      setError(
        "Please complete the 'I'm not a robot' verification."
      );

      return false;
    }

    return true;
  };

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!requireCaptcha()) {
      return;
    }

    setLoading(true);

    try {
      const loggedInUser =
        await login(
          email.trim(),
          password
        );

      if (!loggedInUser.emailVerified) {
        setMode('verification');
        setSuccess(
          'Please verify your email address before entering Daily Pulse.'
        );
        return;
      }

      onSuccess?.(loggedInUser);
    } catch (err) {
      setError(
        getErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const name =
      displayName.trim();

    if (!name) {
      setError(
        'Please enter your username.'
      );
      return;
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.'
      );
      return;
    }

    if (!requireCaptcha()) {
      return;
    }

    setLoading(true);

    try {
      const newUser =
        await register(
          email.trim(),
          password,
          name
        );

      setMode('verification');

      setSuccess(
        `A verification link has been sent to ${newUser.email ?? email.trim()}.`
      );
    } catch (err) {
      setError(
        getErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification =
    async () => {
      setError('');
      setSuccess('');
      setLoading(true);

      try {
        await sendVerificationEmail();

        setSuccess(
          'A new verification link has been sent to your email.'
        );
      } catch (err) {
        setError(
          getErrorMessage(err)
        );
      } finally {
        setLoading(false);
      }
    };

  const handleCheckVerification =
    async () => {
      setError('');
      setSuccess('');
      setVerificationChecking(true);

      try {
        const verified =
          await refreshVerification();

        if (verified) {
          setSuccess(
            'Email verified successfully!'
          );

          setTimeout(() => {
            onSuccess?.(
              user ?? undefined
            );
          }, 500);

          return;
        }

        setError(
          'Your email is not verified yet. Please open the verification link sent to your email.'
        );
      } catch (err) {
        setError(
          getErrorMessage(err)
        );
      } finally {
        setVerificationChecking(false);
      }
    };

  const handleGuestMode = () => {
    setError('');
    setSuccess('');

    continueAsGuest();

    if (modal) {
      onClose?.();
    }

    onSuccess?.();
  };

  const handleSignOut = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await logout();

      setMode('login');
      setEmail('');
      setPassword('');
      setDisplayName('');
      setConfirmPassword('');
      setCaptchaToken(null);
    } catch (err) {
      setError(
        getErrorMessage(err)
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-white px-12 py-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

  const containerClass = modal
    ? 'fixed inset-0 z-[100000] flex h-dvh w-screen items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md'
    : 'flex min-h-dvh w-full items-center justify-center overflow-y-auto bg-slate-950 p-4';

  const cardClass =
    'relative my-auto w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-slate-950';

  if (mode === 'verification') {
    return (
      <div className={containerClass}>
        <div className={cardClass}>
          {modal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 z-10 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}

          <div className="p-7 sm:p-9">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10">
                <ShieldCheck
                  size={42}
                  className="text-indigo-500"
                />
              </div>

              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Verify Your Email
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                We've sent a verification link to your email address.
              </p>
            </div>

            <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-center dark:border-indigo-500/20 dark:bg-indigo-500/10">
              <Mail
                size={20}
                className="mx-auto mb-2 text-indigo-500"
              />

              <p className="break-all text-sm font-bold text-slate-800 dark:text-slate-200">
                {user?.email ?? email}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={verificationChecking}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {verificationChecking ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    I've Verified My Email
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <RefreshCw size={18} />
                )}

                Resend Verification Email
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Open the email and click the verification link.
              Then return here and press "I've Verified My Email".
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        {modal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-10 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-7 sm:p-9">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl shadow-lg shadow-indigo-500/20">
              ⚡
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Daily Pulse
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Daily Brain Training
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium leading-5 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>{success}</span>
            </div>
          )}

          {mode === 'login' && (
            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-center overflow-hidden rounded-xl py-1">
                <ReCAPTCHA
                  sitekey={
                    RECAPTCHA_SITE_KEY
                  }
                  onChange={
                    handleCaptchaChange
                  }
                  onExpired={() =>
                    setCaptchaToken(null)
                  }
                  onErrored={() => {
                    setCaptchaToken(null);
                    setError(
                      'reCAPTCHA could not load. Please try again.'
                    );
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !captchaToken
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Username
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) =>
                      setDisplayName(event.target.value)
                    }
                    placeholder="Your username"
                    autoComplete="name"
                    maxLength={40}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-center overflow-hidden rounded-xl py-1">
                <ReCAPTCHA
                  sitekey={
                    RECAPTCHA_SITE_KEY
                  }
                  onChange={
                    handleCaptchaChange
                  }
                  onExpired={() =>
                    setCaptchaToken(null)
                  }
                  onErrored={() => {
                    setCaptchaToken(null);
                    setError(
                      'reCAPTCHA could not load. Please try again.'
                    );
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  !captchaToken
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Or
            </span>

            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <button
            type="button"
            onClick={handleGuestMode}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Continue as Guest
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            Guest progress is stored locally on this device.
            Create an account to use email authentication.
          </p>
        </div>
      </div>
    </div>
  );
}