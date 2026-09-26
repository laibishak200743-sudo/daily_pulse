import React, { useState } from 'react';
import {
  History,
  Calendar,
  Trophy,
  Zap,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { SessionResult, Language } from '../types';
import { sounds } from '../utils/audio';
import { translations } from '../data/translations';

interface HistoryScreenProps {
  history: SessionResult[];
  language: Language;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, language }) => {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar' || language === 'ur';
  const [selectedSession, setSelectedSession] = useState<SessionResult | null>(null);

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.history}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.heroTagline}
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <History className="w-5 h-5" />
        </div>
      </div>

      {/* History List or Empty State */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <Sparkles className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {t.noHistoryYet}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t.noHistoryDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((sess) => {
            const dateObj = new Date(sess.timestamp);
            const dateStr = dateObj.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = dateObj.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={sess.id}
                onClick={() => {
                  sounds.playTap();
                  setSelectedSession(sess);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    sounds.playTap();
                    setSelectedSession(sess);
                  }
                }}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between text-start active:scale-[0.99] shadow-sm"
              >
                {/* Left: Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
                      {t[`cat_${sess.sessionType}`] || sess.sessionType}
                    </span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase">
                      {t[`diff_${sess.difficulty}`] || sess.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {dateStr} ({timeStr})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {sess.timeSpentSeconds}s
                    </span>
                  </div>
                </div>

                {/* Right: Scores & Chevron */}
                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <span className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white block">
                      {sess.score.toLocaleString()} PTS
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                      +{sess.earnedXp} XP · {sess.accuracy}%
                    </span>
                  </div>

                  {isRtl ? (
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL FOR SPECIFIC PAST SESSION */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.viewSessionResults}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {selectedSession.date}
                </span>
              </div>
              <button
                onClick={() => {
                  sounds.playTap();
                  setSelectedSession(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Session Quick Metrics Banner */}
            <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">{t.score}</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {selectedSession.score}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">{t.xpEarned}</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                  +{selectedSession.earnedXp}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">{t.accuracy}</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedSession.accuracy}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">{t.duration}</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-cyan-600 dark:text-cyan-400">
                  {selectedSession.timeSpentSeconds}s
                </span>
              </div>
            </div>

            {/* Questions Breakdown List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.questionsInSession} ({selectedSession.questionResults.length})
              </h4>

              <div className="space-y-2">
                {selectedSession.questionResults.map((q, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      q.isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {q.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span className="font-bold text-slate-900 dark:text-white">
                          #{idx + 1} {isRtl ? q.titleAr : q.titleEn}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-600 dark:text-slate-400 text-[11px]">
                        +{q.scoreAwarded} PTS · {q.timeTaken}s
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-500 block">{t.details}:</span>
                        <span className="font-medium">{q.userAnswer}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{t.correctAnswer}:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {q.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {(q.explanationAr || q.explanationEn) && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800/60 leading-relaxed">
                        {t.explanation} {isRtl ? q.explanationAr : q.explanationEn}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                setSelectedSession(null);
              }}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
