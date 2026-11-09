import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Construction uses a dedicated Firebase project so accounts and stored records
// are isolated from the original manufacturing service.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_CONSTRUCTION_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDsX3DbwYBFHFzvZZfTghpPBSWU3oLvBbM',
  authDomain: import.meta.env.VITE_CONSTRUCTION_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'kras1-8da40.firebaseapp.com',
  projectId: import.meta.env.VITE_CONSTRUCTION_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID || 'kras1-8da40',
  storageBucket: import.meta.env.VITE_CONSTRUCTION_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'kras1-8da40.appspot.com',
  messagingSenderId: import.meta.env.VITE_CONSTRUCTION_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '541018613242',
  appId: import.meta.env.VITE_CONSTRUCTION_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID || '1:541018613242:web:674857aae8b1775081b043',
};

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
