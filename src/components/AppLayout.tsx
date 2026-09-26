import React, { useState } from 'react';
import {
  Home,
  BarChart3,
  Award,
  Trophy,
  Settings,
  History,
  Flame,
  Zap,
  Play,
  Globe2,
  Brain,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

import {
  TabType,
  Language,
  UserStats,
  AppSettings,
  ThemeMode,
} from '../types';

import { sounds } from '../utils/audio';
import {
  translations,
  SUPPORTED_LANGUAGES,
} from '../data/translations';

interface AppLayoutProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  stats: UserStats;
  settings: AppSettings;
  onQuickPlay: () => void;
  onSelectLanguage: (lang: Language) => void;
  onSelectTheme: (theme: ThemeMode) => void;
  unreadChallengesCount?: number;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onTabChange,
  language,
  stats,
  settings,
  onQuickPlay,
  onSelectLanguage,
  onSelectTheme,
  unreadChallengesCount = 0,
  children,
}) => {
  const t =
    translations[language] || translations.en;

  const isRtl =
    language === 'ar' || language === 'ur';

  const [langDropdownOpen, setLangDropdownOpen] =
    useState(false);

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{
      className?: string;
    }>;
    hasBadge?: boolean;
  }[] = [
    {
      id: 'home',
      label: t.home,
      icon: Home,
      hasBadge:
        unreadChallengesCount > 0,
    },
    {
      id: 'stats',
      label: t.stats,
      icon: BarChart3,
    },
    {
      id: 'badges',
      label: t.badges,
      icon: Award,
    },
    {
      id: 'leaderboard',
      label: t.leaderboard,
      icon: Trophy,
    },
    {
      id: 'history',
      label: t.history,
      icon: History,
    },
    {
      id: 'settings',
      label: t.settings,
      icon: Settings,
    },
  ];

  const mobileTabs = navItems.filter(
    (item) => item.id !== 'history'
  );

  const currentTheme =
    settings.theme || 'system';

  const cycleTheme = () => {
    sounds.playTap();

    if (currentTheme === 'dark') {
      onSelectTheme('light');
    } else if (currentTheme === 'light') {
      onSelectTheme('system');
    } else {
      onSelectTheme('dark');
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 selection:bg-amber-500/20 selection:text-amber-500"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ============================================================ */}
      {/* TOP APP BAR */}
      {/* ============================================================ */}

      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sounds.playTap();
                onTabChange('home');
              }}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-lg text-amber-400">
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-amber-400" />

                    <Zap
                      className="absolute w-3.5 h-3.5 text-white fill-amber-400 stroke-[3]"
                      style={{
                        filter:
                          'drop-shadow(0 0 2px rgba(251, 191, 36, 0.8))',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-start">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white block leading-none">
                  Daily{' '}
                  <span className="text-amber-500">
                    Pulse
                  </span>
                </span>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider block mt-0.5">
                  {t.appTagline}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playTap();
                    onTabChange(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />

                  <span>
                    {item.label}
                  </span>

                  {item.hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-950" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Play */}
            <button
              onClick={() => {
                sounds.playTap();
                onQuickPlay();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-transform active:scale-95 shadow-md shadow-amber-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />

              <span>
                {t.quickPlay}
              </span>
            </button>

            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1.5 rounded-xl shadow-inner">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />

              <div className="text-end">
                <span className="text-xs font-black font-mono text-orange-500 dark:text-orange-400 leading-none">
                  {stats.currentStreak}
                </span>

                <span className="text-[9px] text-orange-600 dark:text-orange-300 font-semibold ms-1 hidden sm:inline">
                  {t.days}
                </span>
              </div>
            </div>

            {/* Level / XP */}
            <div className="hidden xs:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
              <Zap className="w-3.5 h-3.5 text-amber-500" />

              <span className="font-bold text-slate-700 dark:text-slate-200 text-[11px]">
                L{stats.level}
              </span>

              <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                ·
              </span>

              <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                {stats.totalXp} XP
              </span>
            </div>

            {/* Theme */}
            <button
              onClick={cycleTheme}
              title={`Theme: ${currentTheme}`}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center text-xs"
            >
              {currentTheme === 'dark' && (
                <Moon className="w-4 h-4 text-amber-400" />
              )}

              {currentTheme === 'light' && (
                <Sun className="w-4 h-4 text-amber-500" />
              )}

              {currentTheme === 'system' && (
                <Laptop className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => {
                  sounds.playTap();
                  setLangDropdownOpen(
                    (open) => !open
                  );
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <Globe2 className="w-4 h-4 text-cyan-500" />

                <span className="text-[11px] uppercase font-mono font-bold">
                  {language}
                </span>
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full end-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 shadow-2xl z-50 animate-in fade-in">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                    Select Language
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-0.5">
                    {SUPPORTED_LANGUAGES.map(
                      (lang) => {
                        const isSelected =
                          language === lang.code;

                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              sounds.playTap();

                              onSelectLanguage(
                                lang.code
                              );

                              setLangDropdownOpen(
                                false
                              );
                            }}
                            className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-start transition-colors ${
                              isSelected
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>
                                {lang.flag}
                              </span>

                              <span>
                                {
                                  lang.nativeName
                                }
                              </span>
                            </span>

                            {isSelected && (
                              <span className="text-amber-500 text-xs">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <button
              onClick={() => {
                sounds.playTap();
                onTabChange('settings');
              }}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 flex items-center justify-center text-base transition-colors shrink-0"
              title={
                settings.profileName ||
                'Profile'
              }
            >
              {settings.avatar || '⚡'}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================================ */}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* ============================================================ */}
      {/* MOBILE NAVIGATION */}
      {/* ============================================================ */}

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 px-2 py-1.5 shadow-2xl safe-area-bottom"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="grid grid-cols-5 items-center">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playTap();
                  onTabChange(tab.id);
                }}
                className="flex flex-col items-center justify-center py-1 relative min-h-[48px] group transition-all"
              >
                <div
                  className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 scale-110 shadow-sm shadow-amber-500/10'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />

                  {tab.hasBadge && (
                    <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-950" />
                  )}
                </div>

                <span
                  className={`text-[10px] tracking-tight mt-0.5 font-medium transition-colors ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <span className="absolute bottom-0.5 w-4 h-0.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};