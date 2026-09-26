import {
  QuestionItem,
  SessionConfig,
  ChallengeCategory,
  DifficultyLevel,
  Language,
} from '../types';
import { QUESTION_POOL } from '../data/questionPool';
import { storageService, getTodayDateString } from '../services/storageService';

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const challengeEngine = {
  // Get deterministic daily featured questions for today
  getDailyFeaturedQuestions: (): QuestionItem[] => {
    const today = getTodayDateString();
    const seed = hashString(today);

    const categories: ChallengeCategory[] = ['logic', 'knowledge', 'math', 'focus', 'speed'];
    const chosen: QuestionItem[] = [];

    categories.forEach((cat, idx) => {
      const candidates = QUESTION_POOL.filter((q) => q.category === cat);
      if (candidates.length > 0) {
        const index = (seed + idx * 7) % candidates.length;
        chosen.push(candidates[index]);
      }
    });

    return chosen;
  },

  // Asynchronous AI-powered Question Generation with Gemini backend proxy
  fetchAiGeneratedQuestions: async (
    config: SessionConfig,
    language: Language
  ): Promise<{ questions: QuestionItem[]; isAi: boolean }> => {
    const seenFingerprints = storageService.loadSeenFingerprints();

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          category: config.type,
          difficulty: config.difficulty,
          questionCount: config.questionCount || 5,
          excludeFingerprints: seenFingerprints,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const newFingerprints: string[] = [];

        const mappedQuestions: QuestionItem[] = data.questions.map((q: {
          id: string;
          category: string;
          difficulty: string;
          question: string;
          options: string[];
          correctAnswer: string;
          correctIndex: number;
          explanation: string;
          xp: number;
          fingerprint?: string;
        }) => {
          if (q.fingerprint) newFingerprints.push(q.fingerprint);

          return {
            id: q.id || `ai_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            category: (q.category as ChallengeCategory) || 'logic',
            difficulty: (q.difficulty as 'easy' | 'medium' | 'hard' | 'expert') || 'medium',
            taskType: 'multiple_choice',
            titleAr: q.category.toUpperCase(),
            titleEn: q.category.toUpperCase(),
            promptAr: q.question,
            promptEn: q.question,
            localizedQuestion: q.question,
            options: q.options,
            optionsAr: q.options,
            optionsEn: q.options,
            correctIndex: q.correctIndex >= 0 ? q.correctIndex : 0,
            explanationAr: q.explanation,
            explanationEn: q.explanation,
            localizedExplanation: q.explanation,
            duration: q.difficulty === 'easy' ? 25 : q.difficulty === 'expert' ? 40 : 30,
            basePoints: q.difficulty === 'easy' ? 100 : q.difficulty === 'expert' ? 200 : 140,
            fingerprint: q.fingerprint,
            isAiGenerated: true,
          };
        });

        if (newFingerprints.length > 0) {
          storageService.addSeenFingerprints(newFingerprints);
        }

        return { questions: mappedQuestions, isAi: true };
      }
    } catch (err) {
      console.warn('AI question generation call failed, falling back to local pool:', err);
    }

    // High quality offline fallback from QUESTION_POOL
    const fallbackQuestions = challengeEngine.generateSessionQuestions(config);
    return { questions: fallbackQuestions, isAi: false };
  },

  // Local verified fallback session questions with anti-repeat
  generateSessionQuestions: (config: SessionConfig): QuestionItem[] => {
    const recentIds = storageService.loadRecentQuestionIds();
    const count = config.questionCount || 5;

    let pool = config.type === 'auto'
      ? [...QUESTION_POOL]
      : QUESTION_POOL.filter((q) => q.category === config.type);

    if (pool.length === 0) {
      pool = [...QUESTION_POOL];
    }

    if (config.difficulty !== 'auto') {
      const diffPool = pool.filter((q) => q.difficulty === config.difficulty);
      if (diffPool.length >= count) {
        pool = diffPool;
      }
    }

    const freshQuestions = pool.filter((q) => !recentIds.includes(q.id));
    const fallbackQuestions = pool.filter((q) => recentIds.includes(q.id));

    const selected: QuestionItem[] = [];
    const usedCategories = new Set<ChallengeCategory>();

    const shuffledFresh = [...freshQuestions].sort(() => Math.random() - 0.5);
    const shuffledFallback = [...fallbackQuestions].sort(() => Math.random() - 0.5);

    if (config.difficulty === 'auto') {
      const ladder: DifficultyLevel[] = ['easy', 'medium', 'medium', 'hard', 'hard'];
      for (let i = 0; i < count; i++) {
        const targetDiff = ladder[i % ladder.length];
        const match =
          shuffledFresh.find(
            (q) =>
              q.difficulty === targetDiff &&
              !selected.some((s) => s.id === q.id) &&
              (config.type !== 'auto' || !usedCategories.has(q.category))
          ) ||
          shuffledFresh.find((q) => !selected.some((s) => s.id === q.id)) ||
          shuffledFallback.find((q) => !selected.some((s) => s.id === q.id));

        if (match) {
          selected.push(match);
          usedCategories.add(match.category);
        }
      }
    } else {
      const combined = [...shuffledFresh, ...shuffledFallback];
      for (const item of combined) {
        if (selected.length >= count) break;
        if (!selected.some((s) => s.id === item.id)) {
          selected.push(item);
        }
      }
    }

    while (selected.length < count && pool.length > 0) {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      if (!selected.some((s) => s.id === randomItem.id)) {
        selected.push(randomItem);
      } else {
        selected.push({ ...randomItem, id: `${randomItem.id}_dup_${selected.length}` });
      }
    }

    const newRecent = [...recentIds, ...selected.map((s) => s.id)];
    storageService.saveRecentQuestionIds(newRecent);

    return selected;
  },

  // Calculate question score
  calculateQuestionScore: (params: {
    basePoints: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    duration: number;
    timeTaken: number;
    isCorrect: boolean;
    currentStreak: number;
  }): {
    score: number;
    base: number;
    speedBonus: number;
    difficultyMultiplier: number;
    streakBonus: number;
  } => {
    if (!params.isCorrect) {
      return { score: 0, base: 0, speedBonus: 0, difficultyMultiplier: 1, streakBonus: 0 };
    }

    const difficultyMultipliers = {
      easy: 1.0,
      medium: 1.25,
      hard: 1.5,
      expert: 1.8,
    };

    const diffMult = difficultyMultipliers[params.difficulty] || 1.0;
    const base = params.basePoints;

    const remainingTimeRatio = Math.max(0, (params.duration - params.timeTaken) / params.duration);
    const speedBonus = Math.round(base * 0.4 * remainingTimeRatio);

    const streakRate = Math.min(0.3, Math.max(0, (params.currentStreak || 0) * 0.02));
    const streakBonus = Math.round((base + speedBonus) * streakRate);

    const total = Math.round((base + speedBonus) * diffMult + streakBonus);

    return {
      score: total,
      base,
      speedBonus,
      difficultyMultiplier: diffMult,
      streakBonus,
    };
  },

  // Calculate session XP
  calculateSessionXp: (totalScore: number, accuracy: number, isFirstDaily: boolean): number => {
    let xp = Math.round(totalScore * 0.12);
    if (accuracy >= 80) xp += 30;
    if (accuracy === 100) xp += 50;
    if (isFirstDaily) xp += 100;
    return Math.max(25, xp);
  },
};
