import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDSA2r-JpsWgnxYxu4JKBgYPmW0yZj2xag',
  authDomain: 'daily-pulse-c4595.firebaseapp.com',
  projectId: 'daily-pulse-c4595',
  storageBucket: 'daily-pulse-c4595.firebasestorage.app',
  messagingSenderId: '764828124778',
  appId: '1:764828124778:web:67cd6e6a9062b5e5402c13',
  measurementId: 'G-P275HC6C82',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;