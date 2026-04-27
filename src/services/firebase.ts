import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser
} from 'firebase/auth';
import type { User } from '../types';

// Environment variables configuration for Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
const firebaseAuth = getAuth(app);

// Helper to map Firebase User to our custom User type
const mapUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || 'Ashu Verma', // Fallback name
    role: 'admin', // Default role for now, as real Firebase Auth lacks role without custom claims
    avatarUrl: firebaseUser.photoURL || undefined,
  };
};

export const auth = {
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return firebaseOnAuthStateChanged(firebaseAuth, (user) => {
      callback(mapUser(user));
    });
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    const cred = await firebaseSignInWithEmailAndPassword(firebaseAuth, email, password);
    return mapUser(cred.user)!;
  },
  signOut: () => firebaseSignOut(firebaseAuth),
  getCurrentUser: () => mapUser(firebaseAuth.currentUser),
};

// Firebase error message mapper
export function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Login failed. Invalid credentials provided.',
  };
  return messages[code] ?? 'An unexpected error occurred. Please try again.';
}
