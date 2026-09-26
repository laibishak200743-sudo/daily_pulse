import React, { useState } from 'react';
import {
  Compass,
  Flame,
  Zap,
  Award,
  Crown,
  ShieldCheck,
  Calculator,
  Brain,
  Globe2,
  Eye,
  Activity,
  Sparkles,
  Lock,
  CheckCircle2,
  X,
  Target,
  Layers,
} from 'lucide-react';
import { Badge, Language } from '../types';
import { sounds } from '../utils/audio';
import { translations } from '../data/translations';
import { getLocalizedBadge } from '../data/badgeTranslations';

interface BadgesScreenProps {
  badges: Badge[];
  language: Language;
}

export const BadgesScreen: React.FC<BadgesScreenProps> = ({ badges, language }) => {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar' || language === 'ur';
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const progressRatio = Math.round((unlockedCount / badges.length) * 100);

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const iconClass = `w-6 h-6 ${unlocked ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`;
    switch (iconName) {
      case 'Compass':
        return <Compass className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Award':
        return <Award className={iconClass} />;
      case 'Crown':
        return <Crown className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      case 'Calculator':
        return <Calculator className={iconClass} />;
      case 'Brain':
        return <Brain className={iconClass} />;
      case 'Globe2':
        return <Globe2 className={iconClass} />;
      case 'Eye':
        return <Eye className={iconClass} />;
      case 'Activity':
        return <Activity className={iconClass} />;
      case 'Target':
        return <Target className={iconClass} />;
      case 'Layers':
        return <Layers className={iconClass} />;
      case 'Sparkles':
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Title & Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.badges}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.heroTagline}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm self-start sm:self-auto">
          <Award className="w-5 h-5 text-amber-500" />
          <div className="text-start">
            <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 block leading-none">
              {unlockedCount} / {badges.length}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
              {progressRatio}% {t.done}
            </span>
          </div>
        </div>
      </div>

      {/* Progress banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 dark:to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.badges}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.todayFeaturedDesc}
            </p>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-slate-300 dark:border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
        </div>
      </div>

      {/* 15 ACHIEVEMENTS GRID (RESPONSIVE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {badges.map((badge) => {
          const loc = getLocalizedBadge(
            badge.id,
            language,
            isRtl ? badge.titleAr : badge.titleEn,
            isRtl ? badge.descAr : badge.descEn,
            isRtl ? badge.criteriaAr : badge.criteriaEn
          );

          const progressPercent = Math.min(
            100,
            Math.round((badge.currentValue / badge.targetValue) * 100)
          );

          return (
            <div
              key={badge.id}
              onClick={() => {
                sounds.playTap();
                setSelectedBadge(badge);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  sounds.playTap();
                  setSelectedBadge(badge);
                }
              }}
              className={`group p-4 rounded-3xl border transition-all text-start relative cursor-pointer active:scale-98 flex flex-col justify-between space-y-3 ${
                badge.unlocked
                  ? 'bg-white dark:bg-slate-900 border-amber-500/30 dark:border-amber-500/40 hover:border-amber-500/60 shadow-md shadow-amber-500/5'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80'
              }`}
            >
              {/* Badge Top Header */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-amber-500/15 to-orange-500/10 border border-amber-500/30 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {renderBadgeIcon(badge.icon, badge.unlocked)}
                </div>

                {badge.unlocked ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.done}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold">
                    <Lock className="w-3 h-3" />
                    <span>{badge.currentValue}/{badge.targetValue}</span>
                  </span>
                )}
              </div>

              {/* Title & Desc */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                  {loc.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {loc.desc}
                </p>
              </div>

              {/* Criteria Progress */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 truncate">
                    {loc.criteria}
                  </span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {badge.unlocked ? (
                      <span className="text-amber-600 dark:text-amber-400">+{badge.rewardXp} XP</span>
                    ) : (
                      `${progressPercent}%`
                    )}
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-amber-500' : 'bg-slate-400 dark:bg-slate-700'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL POPUP MODAL */}
      {selectedBadge && (() => {
        const loc = getLocalizedBadge(
          selectedBadge.id,
          language,
          isRtl ? selectedBadge.titleAr : selectedBadge.titleEn,
          isRtl ? selectedBadge.descAr : selectedBadge.descEn,
          isRtl ? selectedBadge.criteriaAr : selectedBadge.criteriaEn
        );

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl text-center space-y-4 text-slate-900 dark:text-white">
              <button
                onClick={() => {
                  sounds.playTap();
                  setSelectedBadge(null);
                }}
                className="absolute top-4 end-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div
                className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
                  selectedBadge.unlocked
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-amber-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {renderBadgeIcon(selectedBadge.icon, selectedBadge.unlocked)}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {loc.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {loc.desc}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5 text-start">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">{t.details}:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {loc.criteria}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">{t.xpEarned}:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    +{selectedBadge.rewardXp} XP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">{t.accuracy}:</span>
                  <span
                    className={`font-semibold ${
                      selectedBadge.unlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {selectedBadge.unlocked ? `✓ ${t.done}` : `🔒 ${selectedBadge.currentValue}/${selectedBadge.targetValue}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playTap();
                  setSelectedBadge(null);
                }}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
