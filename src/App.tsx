import React, { useEffect, useState } from 'react';

import {
  TabType,
  SessionConfig,
  SessionResult,
  QuestionItem,
  UserStats,
  Badge,
  AppSettings,
  DailyChallengeCard,
  ChallengeCategory,
} from './types';

import {
  initialFeaturedChallenges,
  initialBadges,
  initialLeaderboard,
  initialStats,
  initialSettings,
} from './data/initialData';

import {
  storageService,
  getTodayDateString,
} from './services/storageService';

import {
  loadUserData,
  saveUserData,
  saveHistoryItem,
} from './services/firestoreService';

import { challengeEngine } from './utils/challengeEngine';
import { sounds } from './utils/audio';

import { useAuth } from './contexts/AuthContext';

import { AppLayout } from './components/AppLayout';
import { HomeScreen } from './components/HomeScreen';
import { StatsScreen } from './components/StatsScreen';
import { BadgesScreen } from './components/BadgesScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ChallengeSetupModal } from './components/ChallengeSetupModal';
import { ChallengeSession } from './components/ChallengeSession';
import { DailyResultModal } from './components/DailyResultModal';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  const {
    user,
    loading: authLoading,
    isGuest,
    logout,
  } = useAuth();

  const [currentTab, setCurrentTab] =
    useState<TabType>('home');

  const [hasEnteredApp, setHasEnteredApp] =
    useState(false);

  const [authModalOpen, setAuthModalOpen] =
    useState(false);

  const [cloudDataReady, setCloudDataReady] =
    useState(false);

  // --------------------------------------------------
  // AUTH STATE
  // --------------------------------------------------

  useEffect(() => {
    if (user || isGuest) {
      setHasEnteredApp(true);
    } else {
      setHasEnteredApp(false);
    }
  }, [user, isGuest]);

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setHasEnteredApp(true);
  };

  const handleLogout = async () => {
    await logout();
    setHasEnteredApp(false);
    setCurrentTab('home');
    setCloudDataReady(false);
  };

  const handleTabChange = (tab: TabType) => {
    if (
      tab === 'leaderboard' &&
      (!user || !user.emailVerified)
    ) {
      setAuthModalOpen(true);
      return;
    }

    setCurrentTab(tab);
  };

  // --------------------------------------------------
  // PERSISTENT STATES
  // --------------------------------------------------

  const [stats, setStats] =
    useState<UserStats>(() =>
      storageService.loadStats(initialStats)
    );

  const [badges, setBadges] =
    useState<Badge[]>(() =>
      storageService.loadBadges(initialBadges)
    );

  const [settings, setSettings] =
    useState<AppSettings>(() =>
      storageService.loadSettings(initialSettings)
    );

  const [history, setHistory] =
    useState<SessionResult[]>(() =>
      storageService.loadHistory()
    );

  const [featuredCards, setFeaturedCards] =
    useState<DailyChallengeCard[]>(() =>
      storageService.loadFeaturedCards(
        initialFeaturedChallenges
      )
    );

  // --------------------------------------------------
  // ACTIVE SESSION STATE
  // --------------------------------------------------

  const [setupModalOpen, setSetupModalOpen] =
    useState(false);

  const [lastSetupConfig, setLastSetupConfig] =
    useState<SessionConfig>({
      type: 'auto',
      difficulty: 'auto',
      questionCount: 5,
    });

  const [activeSession, setActiveSession] =
    useState<{
      questions: QuestionItem[];
      config: SessionConfig;
      isFeatured: boolean;
    } | null>(null);

  const [completedResult, setCompletedResult] =
    useState<SessionResult | null>(null);

  const [
    isGeneratingQuestions,
    setIsGeneratingQuestions,
  ] = useState(false);

  // --------------------------------------------------
  // FIRESTORE ACCOUNT SYNC
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setCloudDataReady(true);
      return;
    }

    setCloudDataReady(false);

    const loadCloudData = async () => {
      try {
        const data = await loadUserData(user.uid);

        if (cancelled) return;

        /*
         * If this is the user's first login and there is no
         * Firestore data yet, migrate the existing local data
         * to the user's Firebase account.
         */
        if (!data.stats) {
          const localStats =
            storageService.loadStats(initialStats);

          const localBadges =
            storageService.loadBadges(initialBadges);

          const localSettings =
            storageService.loadSettings(initialSettings);

          const localFeaturedCards =
            storageService.loadFeaturedCards(
              initialFeaturedChallenges
            );

          const localHistory =
            storageService.loadHistory();

          await saveUserData(user.uid, {
            stats: localStats,
            badges: localBadges,
            settings: localSettings,
            featuredCards: localFeaturedCards,
          });

          if (localHistory.length > 0) {
            await Promise.all(
              localHistory.map((result) =>
                saveHistoryItem(
                  user.uid,
                  result
                )
              )
            );
          }

          if (cancelled) return;

          setStats(localStats);
          setBadges(localBadges);
          setSettings(localSettings);
          setFeaturedCards(
            localFeaturedCards
          );
          setHistory(localHistory);

          setCloudDataReady(true);
          return;
        }

        // Existing cloud account data.
        setStats(data.stats);

        setBadges(
          data.badges ?? initialBadges
        );

        setSettings(
          data.settings ?? initialSettings
        );

        setFeaturedCards(
          data.featuredCards ??
            initialFeaturedChallenges
        );

        setHistory(data.history);

        setCloudDataReady(true);
      } catch (error) {
        console.error(
          'Failed to load cloud data:',
          error
        );

        if (!cancelled) {
          setCloudDataReady(true);
        }
      }
    };

    void loadCloudData();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // --------------------------------------------------
  // SAVE ACCOUNT DATA TO FIRESTORE
  // --------------------------------------------------

  useEffect(() => {
    if (
      !user ||
      !cloudDataReady
    ) {
      return;
    }

    void saveUserData(user.uid, {
      stats,
      badges,
      settings,
      featuredCards,
    }).catch((error) => {
      console.error(
        'Failed to save cloud data:',
        error
      );
    });
  }, [
    user,
    cloudDataReady,
    stats,
    badges,
    settings,
    featuredCards,
  ]);

  // --------------------------------------------------
  // LOCAL STORAGE SYNC
  // --------------------------------------------------

  useEffect(() => {
    if (!cloudDataReady) return;

    storageService.saveStats(stats);
  }, [stats, cloudDataReady]);

  useEffect(() => {
    if (!cloudDataReady) return;

    storageService.saveBadges(badges);
  }, [badges, cloudDataReady]);

  useEffect(() => {
    if (!cloudDataReady) return;

    storageService.saveSettings(settings);

    sounds.enabled =
      settings.soundEnabled;

    document.documentElement.lang =
      settings.language;

    document.documentElement.dir =
      settings.language === 'ar' ||
      settings.language === 'ur'
        ? 'rtl'
        : 'ltr';

    const applyTheme = (
      isDark: boolean
    ) => {
      if (isDark) {
        document.documentElement.classList.add(
          'dark'
        );

        document.documentElement.classList.remove(
          'light'
        );
      } else {
        document.documentElement.classList.remove(
          'dark'
        );

        document.documentElement.classList.add(
          'light'
        );
      }
    };

    if (settings.theme === 'dark') {
      applyTheme(true);
    } else if (
      settings.theme === 'light'
    ) {
      applyTheme(false);
    } else {
      const mql =
        window.matchMedia(
          '(prefers-color-scheme: dark)'
        );

      applyTheme(mql.matches);

      const listener = (
        e: MediaQueryListEvent
      ) => {
        applyTheme(e.matches);
      };

      mql.addEventListener(
        'change',
        listener
      );

      return () =>
        mql.removeEventListener(
          'change',
          listener
        );
    }
  }, [
    settings,
    cloudDataReady,
  ]);

  useEffect(() => {
    if (!cloudDataReady) return;

    storageService.saveHistory(history);
  }, [history, cloudDataReady]);

  useEffect(() => {
    if (!cloudDataReady) return;

    storageService.saveFeaturedCards(
      featuredCards
    );
  }, [
    featuredCards,
    cloudDataReady,
  ]);

  const today =
    getTodayDateString();

  const isDailyFeaturedCompleted =
    stats.dailyFeaturedCompletedDate ===
    today;

  // --------------------------------------------------
  // BADGES
  // --------------------------------------------------

  const evaluateBadges = (
    newStats: UserStats,
    lastSessionAccuracy?: number
  ) => {
    setBadges((prevBadges) =>
      prevBadges.map((badge) => {
        if (badge.unlocked) {
          return badge;
        }

        let shouldUnlock = false;

        let currentValue =
          badge.currentValue;

        if (
          badge.id === 'first_challenge' &&
          newStats.totalChallengesCompleted >= 1
        ) {
          shouldUnlock = true;
          currentValue = 1;
        } else if (
          badge.id === 'perfect_score' &&
          lastSessionAccuracy === 100
        ) {
          shouldUnlock = true;
          currentValue = 1;
        } else if (
          badge.id === 'streak_3' &&
          newStats.currentStreak >= 3
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.currentStreak;
        } else if (
          badge.id === 'streak_7' &&
          newStats.currentStreak >= 7
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.currentStreak;
        } else if (
          badge.id === 'streak_30' &&
          newStats.currentStreak >= 30
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.currentStreak;
        } else if (
          badge.id === 'xp_1000' &&
          newStats.totalXp >= 1000
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.totalXp;
        } else if (
          badge.id === 'xp_5000' &&
          newStats.totalXp >= 5000
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.totalXp;
        } else if (
          badge.id === 'challenges_100' &&
          newStats.totalCorrectAnswers >= 100
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.totalCorrectAnswers;
        } else if (
          badge.id === 'challenges_500' &&
          newStats.totalCorrectAnswers >= 500
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.totalCorrectAnswers;
        } else if (
          badge.id === 'logic_master' &&
          newStats.categoryProficiency.logic >= 90
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.categoryProficiency.logic;
        } else if (
          badge.id === 'math_master' &&
          newStats.categoryProficiency.math >= 90
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.categoryProficiency.math;
        } else if (
          badge.id === 'knowledge_master' &&
          newStats.categoryProficiency.knowledge >= 90
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.categoryProficiency.knowledge;
        } else if (
          badge.id === 'focus_master' &&
          newStats.categoryProficiency.focus >= 90
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.categoryProficiency.focus;
        } else if (
          badge.id === 'speed_master' &&
          newStats.categoryProficiency.speed >= 90
        ) {
          shouldUnlock = true;
          currentValue =
            newStats.categoryProficiency.speed;
        } else if (
          badge.id === 'complete_all_five' &&
          newStats.dailyFeaturedCompletedDate ===
            today
        ) {
          shouldUnlock = true;
          currentValue = 5;
        }

        if (shouldUnlock) {
          sounds.playSuccess();

          return {
            ...badge,
            unlocked: true,
            currentValue,
            unlockedAt: today,
          };
        }

        return badge;
      })
    );
  };

  // --------------------------------------------------
  // AI QUESTION GENERATION
  // --------------------------------------------------

  const generateAndStartSession =
    async (
      config: SessionConfig,
      isFeatured = false
    ) => {
      if (isGeneratingQuestions) {
        return;
      }

      sounds.playTap();
      setIsGeneratingQuestions(true);

      try {
        const result =
          await challengeEngine.fetchAiGeneratedQuestions(
            config,
            settings.language
          );

        if (
          !result.questions ||
          result.questions.length === 0
        ) {
          throw new Error(
            'No questions were generated.'
          );
        }

        setLastSetupConfig(config);

        setActiveSession({
          questions:
            result.questions,
          config: {
            ...config,
            questionCount:
              result.questions.length,
          },
          isFeatured,
        });
      } catch (error) {
        console.error(
          'Question generation failed:',
          error
        );

        const fallbackQuestions =
          challengeEngine.generateSessionQuestions(
            config
          );

        if (
          fallbackQuestions.length > 0
        ) {
          setLastSetupConfig(config);

          setActiveSession({
            questions:
              fallbackQuestions,
            config: {
              ...config,
              questionCount:
                fallbackQuestions.length,
            },
            isFeatured,
          });
        }
      } finally {
        setIsGeneratingQuestions(
          false
        );
      }
    };

  // --------------------------------------------------
  // DAILY FEATURED
  // --------------------------------------------------

  const handleStartFeaturedSession =
    () => {
      sounds.playTap();

      const questions =
        challengeEngine.getDailyFeaturedQuestions();

      const config: SessionConfig = {
        type: 'auto',
        difficulty: 'auto',
        questionCount:
          questions.length,
      };

      setActiveSession({
        questions,
        config,
        isFeatured: true,
      });
    };

  // --------------------------------------------------
  // QUICK PLAY
  // --------------------------------------------------

  const handleQuickPlay = async () => {
    const config: SessionConfig = {
      type: 'auto',
      difficulty: 'auto',
      questionCount: 5,
    };

    await generateAndStartSession(
      config,
      false
    );
  };

  // --------------------------------------------------
  // CUSTOM SESSION
  // --------------------------------------------------

  const handleStartCustomSession =
    async (
      config: SessionConfig
    ) => {
      setSetupModalOpen(false);

      await generateAndStartSession(
        config,
        false
      );
    };

  // --------------------------------------------------
  // SINGLE CATEGORY
  // --------------------------------------------------

  const handlePlaySingleCategory =
    async (
      category: string
    ) => {
      const config: SessionConfig = {
        type:
          category as ChallengeCategory,
        difficulty: 'auto',
        questionCount: 5,
      };

      await generateAndStartSession(
        config,
        false
      );
    };

  // --------------------------------------------------
  // FINISH SESSION
  // --------------------------------------------------

  const handleFinishSession = (
    result: SessionResult
  ) => {
    setActiveSession(null);
    setCompletedResult(result);

    let newStreak =
      stats.currentStreak;

    let newLongest =
      stats.longestStreak;

    let newFeaturedDate =
      stats.dailyFeaturedCompletedDate;

    if (
      stats.lastActiveDate !== today
    ) {
      newStreak =
        stats.currentStreak + 1;

      newLongest = Math.max(
        newStreak,
        stats.longestStreak
      );
    }

    if (
      activeSession?.isFeatured
    ) {
      newFeaturedDate = today;

      setFeaturedCards((prev) =>
        prev.map((card) => ({
          ...card,
          completed: true,
        }))
      );
    }

    const newTotalXp =
      stats.totalXp +
      result.earnedXp;

    const newTotalScore =
      stats.totalScore +
      result.score;

    const newPersonalBest =
      Math.max(
        stats.personalBest,
        result.score
      );

    const newDailyBest =
      Math.max(
        stats.dailyBest,
        result.score
      );

    const newLevel =
      Math.max(
        stats.level,
        Math.floor(
          newTotalXp / 1000
        ) + 1
      );

    const newChallengesCompleted =
      stats.totalChallengesCompleted +
      1;

    const newQuestionsAnswered =
      stats.totalQuestionsAnswered +
      result.questionsCount;

    const newCorrectAnswers =
      stats.totalCorrectAnswers +
      result.correctCount;

    const newWrongAnswers =
      stats.totalWrongAnswers +
      (
        result.questionsCount -
        result.correctCount
      );

    const newAccuracy =
      Math.round(
        (
          newCorrectAnswers /
          Math.max(
            1,
            newQuestionsAnswered
          )
        ) * 100
      );

    const newAverageScore =
      Math.round(
        newTotalScore /
        Math.max(
          1,
          newChallengesCompleted
        )
      );

    const updatedProficiency = {
      ...stats.categoryProficiency,
    };

    result.questionResults.forEach(
      (question) => {
        if (
          question.isCorrect &&
          updatedProficiency[
            question.category
          ] !== undefined
        ) {
          updatedProficiency[
            question.category
          ] = Math.min(
            99,
            updatedProficiency[
              question.category
            ] + 1
          );
        }
      }
    );

    const newStats: UserStats = {
      ...stats,

      totalXp: newTotalXp,
      totalScore: newTotalScore,

      personalBest:
        newPersonalBest,

      dailyBest:
        newDailyBest,

      currentStreak:
        newStreak,

      longestStreak:
        newLongest,

      lastActiveDate:
        today,

      dailyFeaturedCompletedDate:
        newFeaturedDate,

      level:
        newLevel,

      accuracy:
        newAccuracy,

      totalCorrectAnswers:
        newCorrectAnswers,

      totalWrongAnswers:
        newWrongAnswers,

      totalChallengesCompleted:
        newChallengesCompleted,

      totalQuestionsAnswered:
        newQuestionsAnswered,

      averageScore:
        newAverageScore,

      averageTimeSeconds:
        Math.round(
          (
            stats.averageTimeSeconds +
            result.timeSpentSeconds
          ) / 2
        ),

      categoryProficiency:
        updatedProficiency,
    };

    setStats(newStats);

    setHistory((prev) => [
      result,
      ...prev,
    ]);

    evaluateBadges(
      newStats,
      result.accuracy
    );

    // Immediately save the completed
    // session to Firestore for logged-in users.
    if (user) {
      void saveHistoryItem(
        user.uid,
        result
      ).catch((error) => {
        console.error(
          'Failed to save history:',
          error
        );
      });
    }
  };

  // --------------------------------------------------
  // REWARD XP
  // --------------------------------------------------

  const handleRewardXp = (
    amount: number
  ) => {
    const newTotalXp =
      stats.totalXp + amount;

    const newLevel =
      Math.max(
        stats.level,
        Math.floor(
          newTotalXp / 1000
        ) + 1
      );

    const newStats = {
      ...stats,
      totalXp: newTotalXp,
      level: newLevel,
    };

    setStats(newStats);

    evaluateBadges(newStats);
  };

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  const handleResetData = () => {
    storageService.clearAllData();

    setStats(initialStats);

    setBadges(initialBadges);

    setSettings(initialSettings);

    setHistory([]);

    setFeaturedCards(
      initialFeaturedChallenges
    );

    sounds.playTap();
  };

  // --------------------------------------------------
  // AUTH LOADING
  // --------------------------------------------------

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: '#fff',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 42,
          }}
        >
          ⚡
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          Daily Pulse
        </div>

        <div
          style={{
            opacity: 0.6,
            fontSize: 13,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // AUTH SCREEN / GUEST MODE
  // --------------------------------------------------

  if (
    !hasEnteredApp ||
    (!user && !isGuest)
  ) {
    return (
      <AuthScreen
        language={settings.language}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  // --------------------------------------------------
  // EMAIL VERIFICATION
  // --------------------------------------------------

  if (
    user &&
    !user.emailVerified
  ) {
    return (
      <AuthScreen
        language={settings.language}
        initialMode="verification"
        onSuccess={handleAuthSuccess}
      />
    );
  }

  // --------------------------------------------------
  // CLOUD DATA LOADING
  // --------------------------------------------------

  if (
    user &&
    !cloudDataReady
  ) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020617',
          color: '#fff',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 42,
          }}
        >
          ☁️
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          Daily Pulse
        </div>

        <div
          style={{
            opacity: 0.6,
            fontSize: 13,
          }}
        >
          Syncing your account...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // RENDER APP
  // --------------------------------------------------

  return (
    <>
      <AppLayout
        currentTab={currentTab}
        onTabChange={handleTabChange}
        language={settings.language}
        stats={stats}
        settings={settings}
        onQuickPlay={
          handleQuickPlay
        }
        onSelectLanguage={(lang) =>
          setSettings((prev) => ({
            ...prev,
            language: lang,
          }))
        }
        onSelectTheme={(theme) =>
          setSettings((prev) => ({
            ...prev,
            theme,
          }))
        }
        unreadChallengesCount={
          isDailyFeaturedCompleted
            ? 0
            : 5
        }
      >
        {currentTab === 'home' && (
          <HomeScreen
            challenges={
              featuredCards
            }
            stats={stats}
            language={
              settings.language
            }
            userName={
              isGuest
                ? settings.profileName ||
                  'Guest'
                : user?.displayName?.trim() ||
                  'User'
            }
            isDailyCompleted={
              isDailyFeaturedCompleted
            }
            onStartFeaturedSession={
              handleStartFeaturedSession
            }
            onOpenSetupModal={() =>
              setSetupModalOpen(true)
            }
            onQuickPlay={
              handleQuickPlay
            }
            onPlaySingleCategory={
              handlePlaySingleCategory
            }
          />
        )}

        {currentTab === 'stats' && (
          <StatsScreen
            stats={stats}
            language={
              settings.language
            }
            onOpenHistory={() =>
              setCurrentTab(
                'history'
              )
            }
          />
        )}

        {currentTab === 'badges' && (
          <BadgesScreen
            badges={badges}
            language={
              settings.language
            }
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardScreen
            users={
              initialLeaderboard
            }
            stats={stats}
            language={
              settings.language
            }
            currentUserName={
              user?.displayName?.trim() ||
              'User'
            }
            currentUserAvatar={
              settings.avatar
            }
            currentUserCountryCode={
              settings.country
            }
            currentUserCountryName={
              settings.countryName
            }
            currentUserCountryFlag={
              settings.countryFlag
            }
          />
        )}

        {currentTab === 'history' && (
          <HistoryScreen
            history={history}
            language={
              settings.language
            }
          />
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            stats={stats}
            onUpdateSettings={(
              newSettings
            ) =>
              setSettings((prev) => ({
                ...prev,
                ...newSettings,
              }))
            }
            onResetData={
              handleResetData
            }
          />
        )}

        {setupModalOpen &&
          !isGeneratingQuestions && (
            <ChallengeSetupModal
              language={
                settings.language
              }
              initialConfig={
                lastSetupConfig
              }
              onClose={() =>
                setSetupModalOpen(
                  false
                )
              }
              onStartSession={
                handleStartCustomSession
              }
            />
          )}

        {activeSession && (
          <ChallengeSession
            questions={
              activeSession.questions
            }
            config={
              activeSession.config
            }
            language={
              settings.language
            }
            currentStreak={
              stats.currentStreak
            }
            isDailyFeaturedSession={
              activeSession.isFeatured
            }
            onClose={() =>
              setActiveSession(null)
            }
            onFinishSession={
              handleFinishSession
            }
          />
        )}

        {completedResult && (
          <DailyResultModal
            result={
              completedResult
            }
            stats={stats}
            language={
              settings.language
            }
            onPlayAgain={() => {
              setCompletedResult(
                null
              );

              setSetupModalOpen(
                true
              );
            }}
            onQuickPlay={() => {
              setCompletedResult(
                null
              );

              handleQuickPlay();
            }}
            onViewStats={() => {
              setCompletedResult(
                null
              );

              setCurrentTab(
                'stats'
              );
            }}
            onGoHome={() => {
              setCompletedResult(
                null
              );

              setCurrentTab(
                'home'
              );
            }}
            onRewardXp={
              handleRewardXp
            }
          />
        )}
      </AppLayout>

      {/* LOGIN REQUIRED FOR LEADERBOARD */}
      {authModalOpen && (
        <AuthScreen
          language={
            settings.language
          }
          modal
          onClose={() =>
            setAuthModalOpen(
              false
            )
          }
          onSuccess={() => {
            setAuthModalOpen(
              false
            );

            setCurrentTab(
              'leaderboard'
            );

            setHasEnteredApp(
              true
            );
          }}
        />
      )}

      {/* AI GENERATING OVERLAY */}
      {isGeneratingQuestions && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'rgba(0, 0, 0, 0.72)',
            backdropFilter:
              'blur(8px)',
          }}
        >
          <div
            style={{
              width:
                'min(90%, 420px)',
              padding:
                '36px 28px',
              borderRadius: 24,
              background:
                'var(--background, #ffffff)',
              textAlign: 'center',
              boxShadow:
                '0 25px 80px rgba(0,0,0,0.35)',
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                margin:
                  '0 auto 22px',
                borderRadius:
                  '50%',
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                fontSize: 38,
                background:
                  'linear-gradient(135deg, #6366f1, #8b5cf6)',
                animation:
                  'aiPulse 1.5s ease-in-out infinite',
              }}
            >
              🧠
            </div>

            <h2
              style={{
                margin:
                  '0 0 10px',
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              جاري توليد الأسئلة...
            </h2>

            <p
              style={{
                margin: 0,
                opacity: 0.7,
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              الذكاء الاصطناعي يقوم
              بإعداد تحدٍ جديد وفريد
              لك.
            </p>

            <div
              style={{
                marginTop: 24,
                display: 'flex',
                justifyContent:
                  'center',
                gap: 7,
              }}
            >
              <span className="ai-loading-dot" />
              <span className="ai-loading-dot" />
              <span className="ai-loading-dot" />
            </div>
          </div>

          <style>
            {`
              @keyframes aiPulse {
                0%, 100% {
                  transform: scale(1);
                  opacity: 1;
                }

                50% {
                  transform: scale(1.08);
                  opacity: 0.8;
                }
              }

              @keyframes aiDot {
                0%, 80%, 100% {
                  transform: translateY(0);
                  opacity: 0.4;
                }

                40% {
                  transform: translateY(-7px);
                  opacity: 1;
                }
              }

              .ai-loading-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #6366f1;
                animation: aiDot 1.2s infinite ease-in-out;
              }

              .ai-loading-dot:nth-child(2) {
                animation-delay: 0.15s;
              }

              .ai-loading-dot:nth-child(3) {
                animation-delay: 0.3s;
              }
            `}
          </style>
        </div>
      )}
    </>
  );
}