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
  SessionResult,
  UserStats,
} from '../types';

import { db } from '../lib/firebase';

const USERS_COLLECTION = 'users';
const HISTORY_COLLECTION = 'history';

export interface CloudUserData {
  stats?: UserStats;
  badges?: Badge[];
  settings?: AppSettings;
  featuredCards?: DailyChallengeCard[];
  history: SessionResult[];
}

export async function loadUserData(
  uid: string
): Promise<CloudUserData> {
  const userRef = doc(
    db,
    USERS_COLLECTION,
    uid
  );

  const userSnapshot = await getDoc(userRef);

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

  const history = historySnapshot.docs.map(
    (item) =>
      item.data().result as SessionResult
  );

  if (!userSnapshot.exists()) {
    return {
      history,
    };
  }

  const data = userSnapshot.data();

  return {
    stats: data.stats as UserStats | undefined,
    badges: data.badges as Badge[] | undefined,
    settings: data.settings as AppSettings | undefined,
    featuredCards:
      data.featuredCards as
        | DailyChallengeCard[]
        | undefined,
    history,
  };
}

export async function saveUserData(
  uid: string,
  data: {
    stats: UserStats;
    badges: Badge[];
    settings: AppSettings;
    featuredCards: DailyChallengeCard[];
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
      featuredCards: data.featuredCards,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

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
    createdAt: serverTimestamp(),
  });
}