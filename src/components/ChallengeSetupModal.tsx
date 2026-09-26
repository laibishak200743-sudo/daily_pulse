import React, { useState } from 'react';
import {
  X,
  Play,
  Zap,
  Sparkles,
  Brain,
  Globe2,
  Calculator,
  Eye,
  Activity,
  Layers,
  FileText,
  Shapes,
  Atom,
  Landmark,
  Compass,
} from 'lucide-react';
import {
  ChallengeType,
  DifficultyLevel,
  SessionConfig,
  Language,
} from '../types';
import { sounds } from '../utils/audio';
import { translations } from '../data/translations';

interface ChallengeSetupModalProps {
  language: Language;
  initialConfig?: SessionConfig;
  onClose: () => void;
  onStartSession: (config: SessionConfig) => void;
}

export const ChallengeSetupModal: React.FC<ChallengeSetupModalProps> = ({
  language,
  initialConfig,
  onClose,
  onStartSession,
}) => {
  const t = translations[language] || translations.en;
  const isRtl = language === 'ar' || language === 'ur';

  const [selectedType, setSelectedType] = useState<ChallengeType>(
    initialConfig?.type || 'auto'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(
    initialConfig?.difficulty || 'auto'
  );
  const [questionCount, setQuestionCount] = useState<number>(
    initialConfig?.questionCount || 5
  );

  const challengeTypes: {
    id: ChallengeType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    { id: 'auto', label: t.cat_auto, icon: Sparkles, color: 'text-amber-500' },
    { id: 'logic', label: t.cat_logic, icon: Brain, color: 'text-indigo-400' },
    { id: 'knowledge', label: t.cat_knowledge, icon: Globe2, color: 'text-emerald-400' },
    { id: 'math', label: t.cat_math, icon: Calculator, color: 'text-amber-400' },
    { id: 'focus', label: t.cat_focus, icon: Eye, color: 'text-pink-400' },
    { id: 'speed', label: t.cat_speed, icon: Activity, color: 'text-cyan-400' },
    { id: 'memory', label: t.cat_memory, icon: Layers, color: 'text-purple-400' },
    { id: 'word', label: t.cat_word, icon: FileText, color: 'text-teal-400' },
    { id: 'pattern', label: t.cat_pattern, icon: Shapes, color: 'text-rose-400' },
    { id: 'science', label: t.cat_science, icon: Atom, color: 'text-blue-400' },
    { id: 'history', label: t.cat_history, icon: Landmark, color: 'text-yellow-500' },
    { id: 'geography', label: t.cat_geography, icon: Compass, color: 'text-green-400' },
  ];

  const difficulties: {
    id: DifficultyLevel;
    label: string;
    multiplier: string;
  }[] = [
    { id: 'auto', label: t.diff_auto, multiplier: '1.0x - 1.5x' },
    { id: 'easy', label: t.diff_easy, multiplier: '1.0x' },
    { id: 'medium', label: t.diff_medium, multiplier: '1.25x' },
    { id: 'hard', label: t.diff_hard, multiplier: '1.5x' },
    { id: 'expert', label: t.diff_expert, multiplier: '1.8x' },
  ];

  const handleStart = () => {
    sounds.playTap();
    onStartSession({
      type: selectedType,
      difficulty: selectedDifficulty,
      questionCount,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl text-slate-900 dark:text-slate-100 my-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {t.createChallengeTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.createChallengeDesc}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. CHALLENGE TYPE SELECTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.challengeCategory}
            </label>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-bold">
              {challengeTypes.find((c) => c.id === selectedType)?.label}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-0.5">
            {challengeTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setSelectedType(type.id);
                  }}
                  className={`p-2.5 rounded-2xl border text-start transition-all flex flex-col items-center justify-center text-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-amber-600 dark:text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-950'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${type.color}`} />
                  <span className="text-[11px] font-bold line-clamp-1">
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. DIFFICULTY SELECTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.difficultyLevel}
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {difficulties.find((d) => d.id === selectedDifficulty)?.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {difficulties.map((diff) => {
              const isSelected = selectedDifficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setSelectedDifficulty(diff.id);
                  }}
                  className={`p-2.5 rounded-2xl border text-start transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 text-amber-600 dark:text-white ring-1 ring-amber-400/50'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">
                      {diff.label}
                    </span>
                    <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      {diff.multiplier}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. QUESTION COUNT (5, 10, 15, 20) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-700 dark:text-slate-300 font-semibold">
            {t.questionsInSession}
          </span>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setQuestionCount(num);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors ${
                  questionCount === num
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-transform active:scale-95 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{t.startSessionNow}</span>
        </button>
      </div>
    </div>
  );
};
