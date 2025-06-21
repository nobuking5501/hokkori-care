import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth';
import { auth } from './firebase';
import { createOrUpdateUser } from './firestore';

// リトライ用のユーティリティ関数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // too-many-requestsエラーの場合のみリトライ
      if (error?.code === 'auth/too-many-requests' && i < maxRetries) {
        const delayTime = baseDelay * Math.pow(2, i); // 指数バックオフ
        console.log(`認証リトライ ${i + 1}/${maxRetries + 1} - ${delayTime}ms待機`);
        await delay(delayTime);
        continue;
      }
      
      // その他のエラーまたは最大リトライ数に達した場合は即座に投げる
      throw error;
    }
  }
  
  throw lastError;
};

const googleProvider = new GoogleAuthProvider();

// Google認証でサインイン
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // ユーザー情報をFirestoreに保存または更新
    await createOrUpdateUser({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      role: 'staff', // デフォルトは職員、管理者が後で変更
      facility: 'ほっこり福祉会',
    });
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// メール/パスワードでサインイン
export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  console.log('Attempting to sign in with email:', email);
  
  // 管理者の特別ログイン処理
  if (email === 'admin' && password === 'admin123') {
    console.log('Admin login detected, using admin@hokkori.com');
    email = 'admin@hokkori.com';
  }
  
  // マネージャーの特別ログイン処理
  if (email === 'manager' && password === 'manager123') {
    console.log('Manager login detected, using manager@hokkori.com');
    email = 'manager@hokkori.com';
  }
  
  return retryWithBackoff(async () => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    console.log('Sign in successful, user:', user.uid);
    
    // 管理者の場合は管理者権限を設定
    let role = 'staff';
    let displayName = user.displayName || user.email?.split('@')[0] || '';
    
    if (email === 'admin@hokkori.com') {
      role = 'admin';
      displayName = '総合管理者';
    } else if (email === 'manager@hokkori.com') {
      role = 'manager';
      displayName = '管理者';
    }
    
    console.log('Setting user role:', role, 'for email:', email);
    
    // ユーザー情報をFirestoreに保存または更新
    await createOrUpdateUser({
      uid: user.uid,
      email: user.email || '',
      displayName: displayName,
      photoURL: user.photoURL || undefined,
      role: role as any,
      facility: 'ほっこり福祉会',
    });
    
    console.log('User role saved to Firestore:', role);
    console.log('User data updated in Firestore');
    
    return user;
  });
};

// メール/パスワードでユーザー作成
export const createUserWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // ユーザー情報をFirestoreに保存
    await createOrUpdateUser({
      uid: user.uid,
      email: user.email || '',
      displayName: user.email?.split('@')[0] || '',
      photoURL: user.photoURL || undefined,
      role: 'staff',
      facility: 'ほっこり福祉会',
    });
    
    return user;
  } catch (error) {
    console.error('Error creating user with email:', error);
    throw error;
  }
};

// サインアウト
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// ユーザーロールをチェック
export const checkUserRole = (userRole: string | null): boolean => {
  return userRole !== null;
};

// 管理者権限をチェック
export const isAdmin = (userRole: string | null): boolean => {
  return userRole === 'admin';
};

// 管理者またはマネージャー権限をチェック
export const isManagerOrAdmin = (userRole: string | null): boolean => {
  return userRole === 'admin' || userRole === 'manager';
};