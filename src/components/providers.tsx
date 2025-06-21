'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
});

// 権限キャッシュ
const roleCache = new Map<string, string>();

// 管理者アカウントの直接判定
const getDirectRole = (email: string | null): string | null => {
  if (!email) return null;
  if (email === 'admin@hokkori.com') return 'admin';
  if (email === 'manager@hokkori.com') return 'manager';
  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // 直接判定できる管理者アカウント
        const directRole = getDirectRole(user.email);
        if (directRole) {
          setUserRole(directRole);
          setLoading(false);
          return;
        }

        // キャッシュから権限を取得
        const cachedRole = roleCache.get(user.uid);
        if (cachedRole) {
          setUserRole(cachedRole);
          setLoading(false);
          return;
        }

        // Firestoreから権限を取得（非同期）
        setUserRole('staff'); // デフォルト値で先に画面を表示
        setLoading(false);
        
        try {
          const role = await getUserRole(user.uid);
          const finalRole = role || 'staff';
          roleCache.set(user.uid, finalRole);
          setUserRole(finalRole);
        } catch (error) {
          console.error('Error fetching user role:', error);
          // エラー時もデフォルトのstaffを維持
        }
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}