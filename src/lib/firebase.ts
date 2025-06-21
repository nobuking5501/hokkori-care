import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseアプリケーションの初期化
const app = initializeApp(firebaseConfig);

// Firebase Authentication と Firestore の初期化
export const auth = getAuth(app);
export const db = getFirestore(app);

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