import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// TODO: Replace with your Firebase project credentials
// Get these from Firebase Console: https://console.firebase.google.com
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key-for-development',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef1234567890',
};

// Validate Firebase config
if (firebaseConfig.apiKey === 'demo-key-for-development') {
  console.warn('⚠️ Firebase configuration is using demo/default values. For production, please set proper environment variables in .env.local or Vercel environment settings.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Enable persistence so user stays logged in
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to enable persistence:', error);
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
