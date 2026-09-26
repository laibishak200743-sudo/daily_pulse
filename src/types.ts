import { SupportedLanguage } from './data/translations';

export type TabType = 'home' | 'stats' | 'badges' | 'leaderboard' | 'settings' | 'history';

export type Language = SupportedLanguage;

export type ThemeMode = 'dark' | 'light' | 'system';

export type ChallengeCategory =
  | 'logic'
  | 'knowledge'
  | 'math'
  | 'focus'
  | 'speed'
  | 'memory'
  | 'word'
  | 'pattern'
  | 'science'
  | 'history'
  | 'geography';

export type ChallengeType = 'auto' | ChallengeCategory;

export type DifficultyLevel = 'auto' | 'easy' | 'medium' | 'hard' | 'expert';

export type QuestionTaskType =
  | 'multiple_choice'
  | 'sequence_snap'
  | 'mental_math'
  | 'odd_one_out'
  | 'instant_recall'
  | 'word_puzzle'
  | 'pattern_matrix';

export interface QuestionItem {
  id: string;
  category: ChallengeCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  taskType: QuestionTaskType;
  titleAr: string;
  titleEn: string;
  promptAr: string;
  promptEn: string;
  optionsAr?: string[];
  optionsEn?: string[];
  optionsNumber?: number[];
  options?: string[]; // for AI-generated localized options
  localizedQuestion?: string; // for AI-generated prompt
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
  localizedExplanation?: string;
  duration: number; // in seconds
  basePoints: number;
  oddPuzzleData?: { normal: string; odd: string; oddIndex: number };
  speedSequence?: number[];
  mathEquation?: string;
  sequenceString?: string;
  fingerprint?: string;
  isAiGenerated?: boolean;
}

export interface QuestionResult {
  questionId: string;
  category: ChallengeCategory;
  titleAr: string;
  titleEn: string;
  isCorrect: boolean;
  timeTaken: number;
  scoreAwarded: number;
  userAnswer: string;
  correctAnswer: string;
  explanationAr: string;
  explanationEn: string;
}

export interface SessionConfig {
  type: ChallengeType;
  difficulty: DifficultyLevel;
  questionCount: number;
}

export interface SessionResult {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  sessionType: ChallengeType;
  difficulty: DifficultyLevel;
  score: number;
  earnedXp: number;
  accuracy: number;
  timeSpentSeconds: number;
  questionsCount: number;
  correctCount: number;
  bestCategory: ChallengeCategory;
  questionResults: QuestionResult[];
}

export interface DailyChallengeCard {
  id: ChallengeCategory;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  categoryAr: string;
  categoryEn: string;
  duration: number;
  xpReward: number;
  completed: boolean;
  score?: number;
  bestScore?: number;
}

export interface Badge {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  category: 'streak' | 'xp' | 'level' | 'accuracy' | 'special';
  unlocked: boolean;
  criteriaAr: string;
  criteriaEn: string;
  currentValue: number;
  targetValue: number;
  unlockedAt?: string;
  rewardXp: number;
}

export interface LeaderboardUser {
  userId: string;
  username: string;
  avatar: string;
  countryCode: string;
  countryFlag: string;
  score: number;
  dailyBest: number;
  weeklyBest: number;
  allTimeBest: number;
  level: number;
  streak: number;
  rank?: number;
  countryName?: string;
  isCurrentUser?: boolean;

  // Backward-compatibility aliases
  id?: string;
  name?: string;
  country?: string;
  dailyBestScore?: number;
  weeklyScore?: number;
}

export interface DayActivity {
  date: string;
  dayAr: string;
  dayEn: string;
  completed: boolean;
  score: number;
}

export interface UserStats {
  totalXp: number;
  totalScore: number;
  personalBest: number;
  dailyBest: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyFeaturedCompletedDate: string; // YYYY-MM-DD
  level: number;
  accuracy: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  totalChallengesCompleted: number; // sessions
  totalQuestionsAnswered: number;
  averageScore: number;
  averageTimeSeconds: number;
  categoryProficiency: Record<ChallengeCategory, number>;
  weeklyHistory: DayActivity[];
  challengeHistory: SessionResult[];
}

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
  profileName: string;
  avatar: string;
  country: string;
  countryName: string;
  countryFlag?: string;
  notificationsEnabled: boolean;
  reminderTime: string;
  streakReminder: boolean;
  achievementNotifications: boolean;
  adMobEnabled: boolean;
  soundEnabled: boolean;
}
