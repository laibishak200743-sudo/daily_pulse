import React, { useEffect, useState, useRef } from 'react';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Share2,
  Play,
  RotateCcw,
  BarChart3,
  Home,
  Check,
  Sparkles,
  PlayCircle,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SessionResult, Language, UserStats } from '../types';
import { sounds } from '../utils/audio';
import { translations } from '../data/translations';

interface DailyResultModalProps {
  result: SessionResult;
  stats: UserStats;
  language: Language;
  onPlayAgain: () => void;
  onQuickPlay: () => void;
  onViewStats: () => void;
  onGoHome: () => void;
  onRewardXp: (amount: number) => void;
}

export const DailyResultModal: React.FC<DailyResultModalProps> = ({
  result,
  stats,
  language,
  onPlayAgain,
  onQuickPlay,
  onViewStats,
  onGoHome,
  onRewardXp,
}) => {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar' || language === 'ur';
  const [copiedShare, setCopiedShare] = useState(false);

  // Optional Rewarded Ad state
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [offerDismissed, setOfferDismissed] = useState(false);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }

    return () => {
      if (adTimerRef.current) clearInterval(adTimerRef.current);
    };
  }, []);

  const handleShare = async () => {
    sounds.playTap();
    const shareText = `🎯 Daily Pulse: ${t.sessionCompleted}
📊 ${t.score}: ${result.score.toLocaleString()} PTS
⚡ ${t.xpEarned}: +${result.earnedXp + (rewardClaimed ? 50 : 0)} XP
🔥 ${t.streak}: ${stats.currentStreak} ${t.days}
🎯 ${t.accuracy}: ${result.accuracy}%
Train your brain daily with Daily Pulse!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Pulse Brain Training',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Clipboard fallback
    }
  };

  const handleDismissOffer = () => {
    sounds.playTap();
    setOfferDismissed(true);
  };

  const handleStartAd = () => {
    if (rewardClaimed) return;
    sounds.playTap();
    setIsWatchingAd(true);
    setAdCountdown(5);

    if (adTimerRef.current) clearInterval(adTimerRef.current);

    adTimerRef.current = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          if (adTimerRef.current) clearInterval(adTimerRef.current);
          setTimeout(() => {
            setIsWatchingAd(false);
            setRewardClaimed(true);
            onRewardXp(50);
            sounds.playSuccess();
            try {
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
            } catch {
              // fallback
            }
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSkipOrCancelAd = () => {
    if (adTimerRef.current) clearInterval(adTimerRef.current);
    setIsWatchingAd(false);
    sounds.playTap();
    // Skipped early or cancelled: no bonus awarded
  };

  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;
  const timeFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-slate-100 my-auto space-y-5">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/25">
            <Trophy className="w-9 h-9" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold block">
            {t.sessionCompleted}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {result.score.toLocaleString()}{' '}
            <span className="text-base font-normal text-slate-500 dark:text-slate-400">PTS</span>
          </h2>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">{t.xpEarned}</span>
            <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400">
              +{result.earnedXp + (rewardClaimed ? 50 : 0)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">{t.accuracy}</span>
            <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">{result.accuracy}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">{t.duration}</span>
            <span className="text-base font-black font-mono text-cyan-600 dark:text-cyan-400">{timeFormatted}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">{t.streak}</span>
            <span className="text-base font-black font-mono text-orange-500 flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {stats.currentStreak}d
            </span>
          </div>
        </div>

        {/* Today's Best vs Personal Best Comparison */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.todayBest}:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
              {stats.dailyBest.toLocaleString()} PTS
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="text-end">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{t.personalBest}:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
              {stats.personalBest.toLocaleString()} PTS
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OPTIONAL REWARD OFFER: "Want +50 XP?" */}
        {/* ============================================================== */}
        {rewardClaimed ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{t.adBonusClaimed || '+50 XP Claimed! 🎉'}</span>
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
              +50 XP
            </span>
          </div>
        ) : !offerDismissed ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 dark:to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-start shadow-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {t.wantBonusXp || 'Want +50 XP?'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t.watchShortAdDesc || 'Watch a short ad to earn 50 bonus XP.'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={handleDismissOffer}
                className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold transition-colors"
              >
                {t.btnNoThanks || 'NO THANKS'}
              </button>
              <button
                type="button"
                onClick={handleStartAd}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <PlayCircle className="w-3.5 h-3.5 fill-current" />
                <span>{t.btnWatchAd || 'WATCH AD'}</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Question Results Breakdown */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t.allCategories}
          </span>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {result.questionResults.map((q, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-rose-500 text-rose-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                      ✕
                    </span>
                  )}
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {t[`cat_${q.category}`] || q.category.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-slate-400">{q.timeTaken}s</span>
                  <span
                    className={`font-bold ${
                      q.isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    +{q.scoreAwarded}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">{t.resultCopied}</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-amber-500" />
              <span>{t.shareResult}</span>
            </>
          )}
        </button>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              sounds.playTap();
              onPlayAgain();
            }}
            className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-amber-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.playAgain}</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              onQuickPlay();
            }}
            className="py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Play className="w-4 h-4 fill-current text-amber-400" />
            <span>{t.quickPlay}</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              onViewStats();
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.viewStats}</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              onGoHome();
            }}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.home}</span>
          </button>
        </div>
      </div>

      {/* WATCHING REWARDED AD OVERLAY (OPTIONAL, CANCELABLE) */}
      {isWatchingAd && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="relative w-full max-w-xs rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <button
              onClick={handleSkipOrCancelAd}
              className="absolute top-3 end-3 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Ad (No Reward)"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 mx-auto flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono uppercase tracking-wider block mb-1">
                Sponsor Video Ad (Test)
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Watching for +50 Bonus XP...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                +{adCountdown}s remaining
              </p>
            </div>

            <div className="w-16 h-16 rounded-full border-4 border-amber-500 flex items-center justify-center mx-auto text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {adCountdown}
            </div>

            <button
              onClick={handleSkipOrCancelAd}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline block mx-auto pt-1"
            >
              Skip (No bonus)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
