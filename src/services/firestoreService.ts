import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import type {
  AppSettings,
  Badge,
  DailyChallengeCard,
  LeaderboardUser,
  SessionResult,
  UserStats,
} from '../types';

import { db } from '../lib/firebase';

const USERS_COLLECTION = 'users';
const HISTORY_COLLECTION = 'history';
const LEADERBOARD_COLLECTION = 'leaderboard';

export interface CloudUserData {
  stats?: UserStats;
  badges?: Badge[];
  settings?: AppSettings;
  featuredCards?: DailyChallengeCard[];
  history: SessionResult[];
}

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDateDaysAgo(days: number): string {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(
    date.getDate() - days
  );

  return getLocalDateString(date);
}

/* --------------------------------------------------
   LOAD PRIVATE USER DATA
-------------------------------------------------- */

export async function loadUserData(
  uid: string
): Promise<CloudUserData> {
  const userRef = doc(
    db,
    USERS_COLLECTION,
    uid
  );

  const userSnapshot =
    await getDoc(userRef);

  const historyRef = collection(
    userRef,
    HISTORY_COLLECTION
  );

  const historyQuery = query(
    historyRef,
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const historySnapshot =
    await getDocs(historyQuery);

  const history =
    historySnapshot.docs.map(
      (item) =>
        item.data().result as SessionResult
    );

  if (!userSnapshot.exists()) {
    return {
      history,
    };
  }

  const data =
    userSnapshot.data();

  return {
    stats:
      data.stats as
        | UserStats
        | undefined,

    badges:
      data.badges as
        | Badge[]
        | undefined,

    settings:
      data.settings as
        | AppSettings
        | undefined,

    featuredCards:
      data.featuredCards as
        | DailyChallengeCard[]
        | undefined,

    history,
  };
}

/* --------------------------------------------------
   SAVE PRIVATE USER DATA
-------------------------------------------------- */

export async function saveUserData(
  uid: string,
  data: {
    stats: UserStats;
    badges: Badge[];
    settings: AppSettings;
    featuredCards: DailyChallengeCard[];
    history?: SessionResult[];
  },
  profile?: {
    username: string;
    avatar: string;
    countryCode: string;
    countryName: string;
    countryFlag: string;
  }
): Promise<void> {
  const userRef = doc(
    db,
    USERS_COLLECTION,
    uid
  );

  await setDoc(
    userRef,
    {
      stats: data.stats,
      badges: data.badges,
      settings: data.settings,
      featuredCards:
        data.featuredCards,
      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  /*
   * Keep a separate public/sanitized
   * leaderboard document.
   *
   * We NEVER put settings, badges,
   * history, email or private data here.
   */
  if (profile) {
    const history =
      data.history ?? [];

    const today =
      getLocalDateString();

    const sevenDaysAgo =
      getDateDaysAgo(6);

    const todayScores =
      history
        .filter(
          (item) =>
            item.date === today
        )
        .map(
          (item) => item.score
        );

    const weeklyScores =
      history
        .filter(
          (item) =>
            item.date >=
              sevenDaysAgo &&
            item.date <= today
        )
        .map(
          (item) => item.score
        );

    const allTimeScores =
      history.map(
        (item) => item.score
      );

    /*
     * If history is not available yet,
     * fall back to the current stats.
     */
    const dailyBest =
      todayScores.length > 0
        ? Math.max(...todayScores)
        : data.stats.dailyBest;

    const weeklyBest =
      weeklyScores.length > 0
        ? Math.max(...weeklyScores)
        : data.stats.totalScore;

    const allTimeBest =
      allTimeScores.length > 0
        ? Math.max(...allTimeScores)
        : data.stats.personalBest;

    const leaderboardRef =
      doc(
        db,
        LEADERBOARD_COLLECTION,
        uid
      );

    await setDoc(
      leaderboardRef,
      {
        userId: uid,

        username:
          profile.username.trim() ||
          'User',

        avatar:
          profile.avatar || '⚡',

        countryCode:
          profile.countryCode ||
          'DZ',

        countryName:
          profile.countryName ||
          'Algeria',

        countryFlag:
          profile.countryFlag ||
          '🇩🇿',

        dailyBest,

        weeklyBest,

        allTimeBest,

        level:
          data.stats.level,

        streak:
          data.stats.currentStreak,

        updatedAt:
          serverTimestamp(),
      },
      {
        merge: true,
      }
    );
  }
}

/* --------------------------------------------------
   SAVE SESSION HISTORY
-------------------------------------------------- */

export async function saveHistoryItem(
  uid: string,
  result: SessionResult
): Promise<void> {
  const userRef = doc(
    db,
    USERS_COLLECTION,
    uid
  );

  const historyRef = doc(
    collection(
      userRef,
      HISTORY_COLLECTION
    )
  );

  await setDoc(historyRef, {
    result,
    createdAt:
      serverTimestamp(),
  });
}

/* --------------------------------------------------
   LOAD REAL LEADERBOARD
-------------------------------------------------- */

export async function loadLeaderboard(): Promise<
  LeaderboardUser[]
> {
  const leaderboardRef =
    collection(
      db,
      LEADERBOARD_COLLECTION
    );

  const leaderboardQuery =
    query(
      leaderboardRef,
      orderBy(
        'allTimeBest',
        'desc'
      ),
      limit(500)
    );

  const snapshot =
    await getDocs(
      leaderboardQuery
    );

  return snapshot.docs.map(
    (item) => {
      const data =
        item.data();

      return {
        userId:
          item.id,

        id:
          item.id,

        username:
          data.username ||
          'User',

        name:
          data.username ||
          'User',

        avatar:
          data.avatar ||
          '⚡',

        countryCode:
          data.countryCode ||
          'DZ',

        country:
          data.countryCode ||
          'DZ',

        countryName:
          data.countryName ||
          'Algeria',

        countryFlag:
          data.countryFlag ||
          '🇩🇿',

        score:
          data.allTimeBest ||
          0,

        dailyBest:
          data.dailyBest ||
          0,

        dailyBestScore:
          data.dailyBest ||
          0,

        weeklyBest:
          data.weeklyBest ||
          0,

        weeklyScore:
          data.weeklyBest ||
          0,

        allTimeBest:
          data.allTimeBest ||
          0,

        level:
          data.level ||
          1,

        streak:
          data.streak ||
          0,
      };
    }
  );
}