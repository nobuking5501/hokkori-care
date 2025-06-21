import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBy5ovdvtrA5luW1IhSkKei7qXBQrnwHJU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hokkori-care.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hokkori-care",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hokkori-care.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "579765372377",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:579765372377:web:7ce9b11dd3c6220c9505c8",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-FBXZSDTVLB"
};

// Firebaseアプリケーションの初期化
const app = initializeApp(firebaseConfig);

// Firebase Authentication と Firestore の初期化
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics の初期化（ブラウザでのみ）
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// 開発環境でのエミュレーター接続（一度だけ実行）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (!(auth as any).config?.emulator) {
    try {
      // エミュレーターが利用可能な場合のみ接続
      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
    } catch (error) {
      // エミュレーター接続エラーは無視
    }
  }
}

export default app;