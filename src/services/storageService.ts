import {
  UserStats,
  Badge,
  AppSettings,
  SessionResult,
  DailyChallengeCard,
} from '../types';

const STORAGE_KEYS = {
  STATS: 'daily_pulse_stats_v3',
  BADGES: 'daily_pulse_badges_v3',
  SETTINGS: 'daily_pulse_settings_v3',
  HISTORY: 'daily_pulse_history_v3',
  RECENT_QUESTIONS: 'daily_pulse_recent_questions_v3',
  SEEN_FINGERPRINTS: 'daily_pulse_seen_fingerprints_v3',
  FEATURED_CARDS: 'daily_pulse_featured_cards_v3',
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const storageService = {
  loadStats: (fallback: UserStats): UserStats => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) return fallback;
      const parsed = JSON.parse(data);
      const today = getTodayDateString();
      if (parsed.lastActiveDate !== today) {
        return {
          ...parsed,
          dailyBest: 0,
        };
      }
      return parsed;
    } catch {
      return fallback;
    }
  },

  saveStats: (stats: UserStats): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (err) {
      console.error('Failed to save stats to storage', err);
    }
  },

  loadBadges: (fallback: Badge[]): Badge[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BADGES);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },

  saveBadges: (badges: Badge[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch (err) {
      console.error('Failed to save badges to storage', err);
    }
  },

  loadSettings: (fallback: AppSettings): AppSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return fallback;
      const parsed = JSON.parse(data);
      return {
        ...fallback,
        ...parsed,
        theme: parsed.theme || 'system',
      };
    } catch {
      return fallback;
    }
  },

  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save settings to storage', err);
    }
  },

  loadRecentQuestionIds: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveRecentQuestionIds: (ids: string[]): void => {
    try {
      const capped = ids.slice(-60);
      localStorage.setItem(STORAGE_KEYS.RECENT_QUESTIONS, JSON.stringify(capped));
    } catch (err) {
      console.error('Failed to save recent question IDs', err);
    }
  },

  loadSeenFingerprints: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEEN_FINGERPRINTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSeenFingerprints: (newFingerprints: string[]): void => {
    try {
      const current = storageService.loadSeenFingerprints();
      const combined = Array.from(new Set([...current, ...newFingerprints])).slice(-200);
      localStorage.setItem(STORAGE_KEYS.SEEN_FINGERPRINTS, JSON.stringify(combined));
    } catch (err) {
      console.error('Failed to save seen fingerprints', err);
    }
  },

  loadHistory: (): SessionResult[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistory: (history: SessionResult[]): void => {
    try {
      const capped = history.slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(capped));
    } catch (err) {
      console.error('Failed to save history', err);
    }
  },

  loadFeaturedCards: (fallback: DailyChallengeCard[]): DailyChallengeCard[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEATURED_CARDS);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },

  saveFeaturedCards: (cards: DailyChallengeCard[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEATURED_CARDS, JSON.stringify(cards));
    } catch (err) {
      console.error('Failed to save featured cards', err);
    }
  },

  clearAllData: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (err) {
      console.error('Failed to clear storage', err);
    }
  },
};
