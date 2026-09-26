import React from 'react';
import {
  Flame,
  Brain,
  Globe2,
  Calculator,
  Eye,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Sparkles,
  Sliders,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

import {
  DailyChallengeCard,
  Language,
  UserStats,
} from '../types';

import { sounds } from '../utils/audio';
import { translations } from '../data/translations';

interface HomeScreenProps {
  challenges: DailyChallengeCard[];
  stats: UserStats;
  language: Language;
  userName: string;
  isDailyCompleted: boolean;
  onStartFeaturedSession: () => void;
  onOpenSetupModal: () => void;
  onQuickPlay: () => void;
  onPlaySingleCategory: (category: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  challenges,
  stats,
  language,
  userName,
  isDailyCompleted,
  onStartFeaturedSession,
  onOpenSetupModal,
  onQuickPlay,
  onPlaySingleCategory,
}) => {
  const t =
    translations[language] || translations.en;

  const isRtl =
    language === 'ar' || language === 'ur';

  const completedCount =
    challenges.filter(
      (c) => c.completed
    ).length;

  const progressPercent =
    challenges.length > 0
      ? Math.round(
          (completedCount /
            challenges.length) *
            100
        )
      : 0;

  const currentLevelXp =
    stats.totalXp % 1000;

  const targetLevelXp = 1000;

  const levelPercent = Math.min(
    100,
    Math.round(
      (currentLevelXp /
        targetLevelXp) *
        100
    )
  );

  const getCategoryIcon = (
    id: string
  ) => {
    switch (id) {
      case 'logic':
        return (
          <Brain className="w-5 h-5 text-indigo-400" />
        );

      case 'knowledge':
        return (
          <Globe2 className="w-5 h-5 text-emerald-400" />
        );

      case 'math':
        return (
          <Calculator className="w-5 h-5 text-amber-500" />
        );

      case 'focus':
        return (
          <Eye className="w-5 h-5 text-pink-400" />
        );

      case 'speed':
        return (
          <Zap className="w-5 h-5 text-cyan-400" />
        );

      default:
        return (
          <Sparkles className="w-5 h-5 text-amber-400" />
        );
    }
  };

  const getCategoryBorder = (
    id: string
  ) => {
    switch (id) {
      case 'logic':
        return 'border-indigo-500/20 hover:border-indigo-500/40 bg-gradient-to-r from-indigo-50/50 dark:from-indigo-950/20 to-white dark:to-slate-900/60';

      case 'knowledge':
        return 'border-emerald-500/20 hover:border-emerald-500/40 bg-gradient-to-r from-emerald-50/50 dark:from-emerald-950/20 to-white dark:to-slate-900/60';

      case 'math':
        return 'border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-50/50 dark:from-amber-950/20 to-white dark:to-slate-900/60';

      case 'focus':
        return 'border-pink-500/20 hover:border-pink-500/40 bg-gradient-to-r from-pink-50/50 dark:from-pink-950/20 to-white dark:to-slate-900/60';

      case 'speed':
        return 'border-cyan-500/20 hover:border-cyan-500/40 bg-gradient-to-r from-cyan-50/50 dark:from-cyan-950/20 to-white dark:to-slate-900/60';

      default:
        return 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 1. HERO / USER PROGRESS */}
      {/* ============================================================ */}

      <div className="rounded-3xl bg-gradient-to-br from-white dark:from-slate-900 via-slate-50 dark:via-slate-900/90 to-slate-100 dark:to-slate-950 p-5 sm:p-7 border border-slate-200 dark:border-slate-800/80 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-2xl text-white">
                ⚡
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {userName}
                </h1>

                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                  {t.proMember}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {t.heroTagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-2 rounded-2xl shadow-inner">
              <Flame className="w-6 h-6 text-orange-500 animate-pulse" />

              <div className="text-start">
                <span className="text-lg font-black font-mono text-orange-600 dark:text-orange-400 leading-none block">
                  {stats.currentStreak}
                </span>

                <span className="text-[10px] text-orange-700 dark:text-orange-300 font-semibold leading-none block mt-0.5">
                  {t.daysStreak}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-2xl shadow-sm">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-none">
                {t.todayBest}
              </span>

              <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400 leading-none block mt-1">
                {stats.dailyBest > 0
                  ? stats.dailyBest.toLocaleString()
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />

              <span>
                {t.level} {stats.level}
              </span>
            </span>

            <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
              <strong className="text-amber-600 dark:text-amber-400 font-bold">
                {currentLevelXp}
              </strong>{' '}
              / {targetLevelXp} XP (
              {levelPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 transition-all duration-500 shadow-sm"
              style={{
                width: `${levelPercent}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. DAILY FEATURED CHALLENGE */}
      {/* ============================================================ */}

      <div className="rounded-3xl bg-white dark:bg-slate-900/60 p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isDailyCompleted
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
              }`}
            >
              {isDailyCompleted ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Sparkles className="w-6 h-6 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {isDailyCompleted
                    ? t.todayFeaturedComplete
                    : t.todayFeaturedTitle}
                </h2>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {completedCount}/
                  {challenges.length}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isDailyCompleted
                  ? t.todayFeaturedCompleteDesc
                  : t.todayFeaturedDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isDailyCompleted ? (
              <button
                onClick={() => {
                  sounds.playTap();
                  onStartFeaturedSession();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-amber-500/25"
              >
                <Play className="w-4 h-4 fill-current" />

                <span>
                  {t.startTodayChallenge}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    sounds.playTap();
                    onOpenSetupModal();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-amber-500/20"
                >
                  <RotateCcw className="w-4 h-4" />

                  <span>
                    {t.playAgain}
                  </span>
                </button>

                <button
                  onClick={() => {
                    sounds.playTap();
                    onQuickPlay();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-500" />

                  <span>
                    {t.quickPlay}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. QUICK PLAY / CUSTOM */}
      {/* ============================================================ */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => {
            sounds.playTap();
            onOpenSetupModal();
          }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-start flex items-center justify-between group transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {t.customStudio}
              </h3>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.customStudioDesc}
              </p>
            </div>
          </div>

          <div className="text-slate-400 group-hover:text-amber-500 transition-colors">
            {isRtl ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </button>

        <button
          onClick={() => {
            sounds.playTap();
            onQuickPlay();
          }}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 text-start flex items-center justify-between group transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {t.instantAuto}
              </h3>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.instantAutoDesc}
              </p>
            </div>
          </div>

          <div className="text-slate-400 group-hover:text-cyan-500 transition-colors">
            {isRtl ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 4. CORE CHALLENGES */}
      {/* ============================================================ */}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-300">
              {t.coreDisciplines}
            </h3>

            <p className="text-xs text-slate-500">
              {t.coreDisciplinesDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {challenges.map((ch) => {
            const isDone = ch.completed;

            const handleCategoryPlay =
              () => {
                sounds.playTap();
                onPlaySingleCategory(
                  ch.id
                );
              };

            return (
              <div
                key={ch.id}
                onClick={
                  handleCategoryPlay
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' ||
                    e.key === ' '
                  ) {
                    e.preventDefault();
                    handleCategoryPlay();
                  }
                }}
                className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-start flex flex-col justify-between space-y-3 active:scale-[0.98] shadow-sm ${getCategoryBorder(
                  ch.id
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {getCategoryIcon(
                        ch.id
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                        {t[
                          `cat_${ch.id}`
                        ] ||
                          ch.id.toUpperCase()}
                      </span>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        {isRtl
                          ? ch.titleAr
                          : ch.titleEn}
                      </h4>
                    </div>
                  </div>

                  {isDone && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      {t.done} ✓
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {isRtl
                    ? ch.subtitleAr
                    : ch.subtitleEn}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60 text-xs">
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                    +{ch.xpReward} XP
                  </span>

                  <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-1 font-semibold text-xs">
                    <span>
                      {t.trainNow}
                    </span>

                    {isRtl ? (
                      <ChevronLeft className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};