import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.toString(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.toString(),
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL?.toString(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.toString(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.toString(),
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.toString(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.toString(),
};

export const app = initializeApp(config);
export const auth = getAuth(app);

const fs = getFirestore();
export const db = {
  tasks: collection(fs, 'tasks'),
  projects: collection(fs, 'projects'),
};
