import React from 'react';
import {
  Zap,
  Trophy,
  Flame,
  Star,
  Brain,
  Globe2,
  Calculator,
  Eye,
  Activity,
  CheckCircle2,
  Target,
  History,
  Layers,
  FileText,
  Shapes,
} from 'lucide-react';
import { Language, UserStats } from '../types';
import { sounds } from '../utils/audio';
import { translations } from '../data/translations';

interface StatsScreenProps {
  stats: UserStats;
  language: Language;
  onOpenHistory: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  stats,
  language,
  onOpenHistory,
}) => {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar' || language === 'ur';

  const categories = [
    {
      id: 'logic',
      title: t.cat_logic,
      value: stats.categoryProficiency.logic,
      color: 'from-indigo-500 to-indigo-400',
      textColor: 'text-indigo-500 dark:text-indigo-400',
      icon: Brain,
    },
    {
      id: 'knowledge',
      title: t.cat_knowledge,
      value: stats.categoryProficiency.knowledge,
      color: 'from-emerald-500 to-emerald-400',
      textColor: 'text-emerald-500 dark:text-emerald-400',
      icon: Globe2,
    },
    {
      id: 'math',
      title: t.cat_math,
      value: stats.categoryProficiency.math,
      color: 'from-amber-500 to-amber-400',
      textColor: 'text-amber-500 dark:text-amber-400',
      icon: Calculator,
    },
    {
      id: 'focus',
      title: t.cat_focus,
      value: stats.categoryProficiency.focus,
      color: 'from-pink-500 to-pink-400',
      textColor: 'text-pink-500 dark:text-pink-400',
      icon: Eye,
    },
    {
      id: 'speed',
      title: t.cat_speed,
      value: stats.categoryProficiency.speed,
      color: 'from-cyan-500 to-cyan-400',
      textColor: 'text-cyan-500 dark:text-cyan-400',
      icon: Activity,
    },
    {
      id: 'memory',
      title: t.cat_memory,
      value: stats.categoryProficiency.memory || 80,
      color: 'from-purple-500 to-purple-400',
      textColor: 'text-purple-500 dark:text-purple-400',
      icon: Layers,
    },
    {
      id: 'word',
      title: t.cat_word,
      value: stats.categoryProficiency.word || 85,
      color: 'from-teal-500 to-teal-400',
      textColor: 'text-teal-500 dark:text-teal-400',
      icon: FileText,
    },
    {
      id: 'pattern',
      title: t.cat_pattern,
      value: stats.categoryProficiency.pattern || 82,
      color: 'from-rose-500 to-rose-400',
      textColor: 'text-rose-500 dark:text-rose-400',
      icon: Shapes,
    },
  ];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Title & History CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.stats}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.heroTagline}
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            onOpenHistory();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <History className="w-4 h-4 text-amber-500" />
          <span>{t.history}</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. PRIMARY METRIC CARDS (RESPONSIVE GRID) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total XP */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.xp}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats.totalXp.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-1 block">
            {t.level} {stats.level}
          </span>
        </div>

        {/* Total Score */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.score}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats.totalScore.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            {stats.totalChallengesCompleted} {t.done}
          </span>
        </div>

        {/* Personal Best */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.personalBest}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats.personalBest.toLocaleString()}
          </div>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1 block">
            {t.todayBest}: {stats.dailyBest}
          </span>
        </div>

        {/* Best Streak */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.streak}
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {stats.currentStreak} <span className="text-xs text-orange-500 font-semibold">{t.days}</span>
          </div>
          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-medium mt-1 block">
            Max: {stats.longestStreak} {t.days}
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ACCURACY & PERFORMANCE BREAKDOWN */}
      {/* ============================================================== */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.accuracy} & {t.stats}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.heroTagline}
              </p>
            </div>
          </div>

          <div className="text-end">
            <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 block leading-none">
              {stats.accuracy}%
            </span>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
              {t.accuracy}
            </span>
          </div>
        </div>

        {/* Accuracy Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(5, stats.accuracy))}%` }}
          />
        </div>

        {/* Micro stats counter line */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.correctAnswer}</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {stats.totalCorrectAnswers}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.incorrectAnswer}</span>
            <span className="font-mono font-bold text-rose-500 text-sm">
              {stats.totalWrongAnswers}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.questionsInSession}</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
              {stats.totalQuestionsAnswered}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.duration}</span>
            <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">
              {stats.averageTimeSeconds}s
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CATEGORY PROFICIENCY (PROGRESS BARS) */}
      {/* ============================================================== */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.allCategories}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.coreDisciplinesDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cat.textColor}`} />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {cat.title}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-slate-600 dark:text-slate-300">
                    {cat.value}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. WEEKLY TRAINING ACTIVITY HEATMAP */}
      {/* ============================================================== */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.streak} (7 {t.days})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.todayFeaturedDesc}
            </p>
          </div>
          <Flame className="w-5 h-5 text-orange-500" />
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {stats.weeklyHistory.map((day, idx) => (
            <div
              key={idx}
              className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
                day.completed
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/60 text-slate-400'
              }`}
            >
              <span className="text-[11px] font-bold block mb-1">
                {isRtl ? day.dayAr : day.dayEn}
              </span>
              <div className="w-6 h-6 mx-auto rounded-full flex items-center justify-center text-xs">
                {day.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                )}
              </div>
              <span className="text-[9px] font-mono font-semibold block mt-1 text-slate-500">
                {day.score > 0 ? `${day.score}p` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
