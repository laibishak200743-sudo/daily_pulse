import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  Globe2,
  Bell,
  Tv,
  Volume2,
  RotateCcw,
  Check,
  Search,
  X,
  ChevronDown,
  Sun,
  Moon,
  Laptop,
  ShieldAlert,
  Mail,
  ShieldCheck,
  LogOut,
  UserRound,
} from 'lucide-react';

import { AppSettings, Language, UserStats, ThemeMode } from '../types';
import { sounds } from '../utils/audio';
import { translations, SUPPORTED_LANGUAGES } from '../data/translations';
import {
  WORLD_COUNTRIES,
  findCountry,
  searchCountries,
  CountryItem,
} from '../data/countries';
import { useAuth } from '../contexts/AuthContext';

interface SettingsScreenProps {
  settings: AppSettings;
  stats: UserStats;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  stats,
  onUpdateSettings,
  onResetData,
}) => {
  const t =
    translations[settings.language] || translations.en;

  const isRtl =
    settings.language === 'ar' ||
    settings.language === 'ur';

  const {
    user,
    isGuest,
    logout,
    updateDisplayName,
    getErrorMessage,
  } = useAuth();

  const [nameInput, setNameInput] =
    useState(settings.profileName);

  const [showSavedToast, setShowSavedToast] =
    useState(false);

  const [showResetConfirmModal, setShowResetConfirmModal] =
    useState(false);

  const [accountMessage, setAccountMessage] =
    useState('');

  const [accountError, setAccountError] =
    useState('');

  const [isSavingAccount, setIsSavingAccount] =
    useState(false);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  // --------------------------------------------------
  // KEEP NAME INPUT IN SYNC WITH FIREBASE USER
  // --------------------------------------------------

  useEffect(() => {
    if (user?.displayName?.trim()) {
      setNameInput(user.displayName.trim());
    } else if (settings.profileName) {
      setNameInput(settings.profileName);
    }
  }, [user?.displayName, settings.profileName]);

  // --------------------------------------------------
  // COUNTRY
  // --------------------------------------------------

  const initialCountryItem = useMemo(() => {
    return (
      findCountry(settings.country) ||
      findCountry(settings.countryName) ||
      WORLD_COUNTRIES.find(
        (c) => c.code === 'DZ'
      ) ||
      WORLD_COUNTRIES[0]
    );
  }, [settings.country, settings.countryName]);

  const [selectedCountry, setSelectedCountry] =
    useState<CountryItem>(
      initialCountryItem
    );

  const [isCountryModalOpen, setIsCountryModalOpen] =
    useState(false);

  const [countrySearchQuery, setCountrySearchQuery] =
    useState('');

  const filteredCountries = useMemo(
    () => searchCountries(countrySearchQuery),
    [countrySearchQuery]
  );

  const avatars = [
    '⚡',
    '🧠',
    '🚀',
    '🎯',
    '🔥',
    '👑',
    '🏆',
    '💎',
  ];

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------

  const handleSaveProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const name = nameInput.trim();

    if (!name) {
      return;
    }

    sounds.playTap();

    setAccountError('');
    setAccountMessage('');
    setIsSavingAccount(true);

    try {
      if (user) {
        await updateDisplayName(name);
      }

      onUpdateSettings({
        profileName: name,
        country: selectedCountry.code,
        countryName: isRtl
          ? selectedCountry.nameAr
          : selectedCountry.name,
        countryFlag: selectedCountry.flag,
      });

      setShowSavedToast(true);

      setTimeout(() => {
        setShowSavedToast(false);
      }, 2000);
    } catch (error) {
      setAccountError(
        getErrorMessage(error)
      );
    } finally {
      setIsSavingAccount(false);
    }
  };

  // --------------------------------------------------
  // COUNTRY
  // --------------------------------------------------

  const handleSelectCountry = (
    country: CountryItem
  ) => {
    sounds.playTap();

    setSelectedCountry(country);
    setIsCountryModalOpen(false);
    setCountrySearchQuery('');

    onUpdateSettings({
      country: country.code,
      countryName: isRtl
        ? country.nameAr
        : country.name,
      countryFlag: country.flag,
    });
  };

  // --------------------------------------------------
  // LANGUAGE
  // --------------------------------------------------

  const handleLanguageChange = (
    lang: Language
  ) => {
    sounds.playTap();

    onUpdateSettings({
      language: lang,
    });

    document.documentElement.lang = lang;

    document.documentElement.dir =
      lang === 'ar' || lang === 'ur'
        ? 'rtl'
        : 'ltr';
  };

  // --------------------------------------------------
  // THEME
  // --------------------------------------------------

  const handleThemeChange = (
    theme: ThemeMode
  ) => {
    sounds.playTap();

    onUpdateSettings({
      theme,
    });
  };

  // --------------------------------------------------
  // SIGN OUT
  // --------------------------------------------------

  const handleSignOut = async () => {
    sounds.playTap();

    setAccountError('');
    setAccountMessage('');
    setIsSigningOut(true);

    try {
      await logout();
    } catch (error) {
      setAccountError(
        getErrorMessage(error)
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div
      className="space-y-6 max-w-4xl mx-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ========================================================= */}
      {/* TITLE */}
      {/* ========================================================= */}

      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {t.settings}
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {t.heroTagline}
        </p>
      </div>

      {/* ========================================================= */}
      {/* ACCOUNT */}
      {/* ========================================================= */}

      <div className="rounded-3xl bg-white dark:bg-slate-900/60 p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
            <UserRound className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Account
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your Daily Pulse account information
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <User className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Username
              </span>

              <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                {user?.displayName?.trim() ||
                  settings.profileName ||
                  (isGuest
                    ? 'Guest'
                    : 'User')}
              </span>
            </div>
          </div>

          {user?.email && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                <Mail className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                  Email
                </span>

                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate block">
                  {user.email}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                user?.emailVerified
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-amber-500/10 text-amber-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Email Status
              </span>

              <span
                className={`text-sm font-bold ${
                  user?.emailVerified
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {user
                  ? user.emailVerified
                    ? 'Verified'
                    : 'Not Verified'
                  : 'Guest Mode'}
              </span>
            </div>
          </div>
        </div>

        {accountError && (
          <div className="rounded-2xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
            {accountError}
          </div>
        )}

        {accountMessage && (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {accountMessage}
          </div>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />

          {isSigningOut
            ? 'Signing Out...'
            : isGuest
              ? 'Exit Guest Mode'
              : 'Sign Out'}
        </button>
      </div>

      {/* ========================================================= */}
      {/* APPEARANCE */}
      {/* ========================================================= */}

      <div className="rounded-3xl bg-white dark:bg-slate-900/60 p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Sun className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.appearance}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {settings.theme === 'dark'
                ? t.themeDark
                : settings.theme === 'light'
                  ? t.themeLight
                  : t.themeSystem}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              value: 'dark' as ThemeMode,
              icon: Moon,
              label: t.themeDark,
              iconClass: 'text-amber-500',
            },
            {
              value: 'light' as ThemeMode,
              icon: Sun,
              label: t.themeLight,
              iconClass: 'text-amber-500',
            },
            {
              value: 'system' as ThemeMode,
              icon: Laptop,
              label: t.themeSystem,
              iconClass: 'text-cyan-500',
            },
          ].map((item) => {
            const Icon = item.icon;
            const selected =
              settings.theme === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  handleThemeChange(
                    item.value
                  )
                }
                className={`py-3.5 px-3 rounded-2xl border text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                  selected
                    ? 'bg-amber-500/15 border-amber-400 text-amber-600 dark:text-amber-300 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${item.iconClass}`}
                />

                <span>{item.label}</span>

                {selected && (
                  <span className="text-amber-500 text-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* LANGUAGES */}
      {/* ========================================================= */}

      <div className="rounded-3xl bg-white dark:bg-slate-900/60 p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
            <Globe2 className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.languageTitle}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              10 Major World Languages (RTL & LTR)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected =
              settings.language === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() =>
                  handleLanguageChange(
                    lang.code
                  )
                }
                className={`py-3 px-3 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-amber-700 dark:text-amber-300 ring-2 ring-amber-400/40 shadow-sm font-bold'
                    : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-lg">
                  {lang.flag}
                </span>

                <span className="truncate w-full">
                  {lang.nativeName}
                </span>

                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {lang.name} (
                  {lang.dir.toUpperCase()})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PROFILE */}
      {/* ========================================================= */}

      <div className="rounded-3xl bg-white dark:bg-slate-900/60 p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <User className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.profileTitle}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.profileDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-500 block">
              {t.level}
            </span>

            <span className="font-bold text-slate-900 dark:text-white font-mono">
              L{stats.level}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block">
              {t.xp}
            </span>

            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
              {stats.totalXp} XP
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block">
              {t.streak}
            </span>

            <span className="font-bold text-orange-500 font-mono">
              {stats.currentStreak}d 🔥
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block">
              {t.personalBest}
            </span>

            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {stats.personalBest}
            </span>
          </div>
        </div>

        {/* AVATAR */}

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Avatar:
          </label>

          <div className="flex flex-wrap gap-2">
            {avatars.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onUpdateSettings({
                    avatar: av,
                  });
                }}
                className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center transition-all ${
                  settings.avatar === av
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-md shadow-amber-500/25'
                    : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* PROFILE FORM */}

        <form
          onSubmit={handleSaveProfile}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {t.displayName}
              </label>

              <input
                type="text"
                value={nameInput}
                onChange={(e) =>
                  setNameInput(
                    e.target.value
                  )
                }
                placeholder="Your name..."
                maxLength={40}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                {t.country}
              </label>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsCountryModalOpen(true);
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between transition-colors shadow-sm text-start"
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="text-lg shrink-0">
                    {selectedCountry.flag}
                  </span>

                  <span className="font-semibold truncate">
                    {isRtl
                      ? selectedCountry.nameAr
                      : selectedCountry.name}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    ({selectedCountry.code})
                  </span>
                </span>

                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              disabled={isSavingAccount}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-transform active:scale-95 shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isSavingAccount
                ? 'Saving...'
                : t.saveProfile}
            </button>

            {showSavedToast && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
                <Check className="w-4 h-4" />
                {t.profileSaved}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* ========================================================= */}
      {/* NOTIFICATIONS */}
      {/* ========================================================= */}

      <div className="rounded-3xl bg-white dark:bg-slate-900/60 p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
            <Bell className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.notificationsTitle}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.streakSaver}
            </p>
          </div>
        </div>

        <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80">
          <div className="flex items-center justify-between pt-1">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.dailyReminder}
              </h4>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.todayFeaturedDesc}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={
                  settings.notificationsEnabled
                }
                onChange={(e) => {
                  sounds.playTap();

                  onUpdateSettings({
                    notificationsEnabled:
                      e.target.checked,
                  });
                }}
                className="sr-only peer"
              />

              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.streakSaver}
              </h4>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.daysStreak}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={
                  settings.streakReminder
                }
                onChange={(e) => {
                  sounds.playTap();

                  onUpdateSettings({
                    streakReminder:
                      e.target.checked,
                  });
                }}
                className="sr-only peer"
              />

              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADMOB */}
      {/* ========================================================= */}

      <div className="rounded-3xl bg-white dark:bg-slate-900/60 p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Tv className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.admobTitle}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.admobDesc}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.adMobEnabled}
              onChange={(e) => {
                sounds.playTap();

                onUpdateSettings({
                  adMobEnabled:
                    e.target.checked,
                });
              }}
              className="sr-only peer"
            />

            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
          </label>
        </div>

        {settings.adMobEnabled && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">
                Google AdMob Live Test Banner (Responsive)
              </span>

              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                🎯 Daily Pulse — Train memory, math, logic & speed every day
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* AUDIO */}
      {/* ========================================================= */}

      <div className="rounded-3xl bg-white dark:bg-slate-900/60 p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Volume2 className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.soundEffects}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.soundDesc}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => {
              sounds.enabled =
                e.target.checked;

              onUpdateSettings({
                soundEnabled:
                  e.target.checked,
              });

              if (e.target.checked) {
                sounds.playTap();
              }
            }}
            className="sr-only peer"
          />

          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
        </label>
      </div>

      {/* ========================================================= */}
      {/* RESET / ABOUT */}
      {/* ========================================================= */}

      <div className="pt-2 space-y-4 text-center">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            setShowResetConfirmModal(true);
          }}
          className="text-xs sm:text-sm text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 flex items-center justify-center gap-1.5 mx-auto py-2 px-4 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border border-rose-200 dark:border-rose-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.resetProgress}</span>
        </button>

        <div className="text-[11px] text-slate-400 dark:text-slate-600 font-mono space-y-1">
          <p>
            Daily Pulse • Version 3.6.0 (ISO 3166-1 Worldwide)
          </p>

          <p>
            Global Leaderboard Architecture • Dark & Light Mode • Multi-Language
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COUNTRY MODAL */}
      {/* ========================================================= */}

      {isCountryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[85vh] text-slate-900 dark:text-white overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  {t.selectCountry ||
                    'Select your country'}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {WORLD_COUNTRIES.length} Countries & Territories (ISO 3166-1)
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setIsCountryModalOpen(false);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />

                <input
                  type="text"
                  autoFocus
                  value={countrySearchQuery}
                  onChange={(e) =>
                    setCountrySearchQuery(
                      e.target.value
                    )
                  }
                  placeholder={
                    t.searchCountry ||
                    'Search country...'
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl ps-10 pe-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
                />

                {countrySearchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setCountrySearchQuery('')
                    }
                    className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[55vh]">
              {filteredCountries.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="font-semibold">
                    No countries found
                  </p>

                  <p className="text-[11px]">
                    Try typing name or 2-letter ISO code (e.g. DZ, US, Alg, United)
                  </p>
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const isCurrent =
                    selectedCountry.code ===
                    c.code;

                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() =>
                        handleSelectCountry(c)
                      }
                      className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors text-start ${
                        isCurrent
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className="text-2xl shrink-0 leading-none">
                          {c.flag}
                        </span>

                        <div className="truncate">
                          <span className="text-xs sm:text-sm block truncate">
                            {isRtl
                              ? c.nameAr
                              : c.name}
                          </span>

                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {isRtl
                              ? c.name
                              : c.nameAr}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                          {c.code}
                        </span>

                        {isCurrent && (
                          <Check className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {filteredCountries.length} countries available
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* RESET MODAL */}
      {/* ========================================================= */}

      {showResetConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/40 p-6 sm:p-7 shadow-2xl text-center space-y-4 text-slate-900 dark:text-white">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 border border-rose-500/30 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {t.resetConfirmTitle}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.resetConfirmDesc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setShowResetConfirmModal(
                    false
                  );
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setShowResetConfirmModal(
                    false
                  );
                  onResetData();
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                {t.yesReset}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};