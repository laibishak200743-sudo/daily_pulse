import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User,
} from 'firebase/auth';

import { FirebaseError } from 'firebase/app';

import { auth } from '../lib/firebase';

async function enablePersistentAuth(): Promise<void> {
  await setPersistence(auth, browserLocalPersistence);
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  await enablePersistentAuth();

  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  const name = displayName.trim();

  if (name) {
    await updateProfile(credential.user, {
      displayName: name,
    });
  }

  await sendEmailVerification(credential.user);

  return credential.user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  await enablePersistentAuth();

  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  await reload(credential.user);

  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function sendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No authenticated user.');
  }

  await sendEmailVerification(user);
}

export async function refreshEmailVerification(): Promise<boolean> {
  const user = auth.currentUser;

  if (!user) {
    return false;
  }

  await reload(user);

  return auth.currentUser?.emailVerified ?? false;
}

export async function updateUserDisplayName(
  displayName: string
): Promise<User> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No authenticated user.');
  }

  const name = displayName.trim();

  if (!name) {
    throw new Error('Display name cannot be empty.');
  }

  await updateProfile(user, {
    displayName: name,
  });

  await reload(user);

  return auth.currentUser ?? user;
}

export function subscribeToAuth(
  callback: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Something went wrong. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';

    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';

    case 'auth/invalid-credential':
      return 'Incorrect email or password.';

    case 'auth/user-not-found':
      return 'No account was found with this email.';

    case 'auth/wrong-password':
      return 'Incorrect password.';

    case 'auth/user-disabled':
      return 'This account has been disabled.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';

    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';

    case 'auth/operation-not-allowed':
      return 'Email and password sign-in is not enabled in Firebase Authentication.';

    case 'auth/requires-recent-login':
      return 'Please sign in again and try this action again.';

    default:
      return 'Authentication failed. Please try again.';
  }
}