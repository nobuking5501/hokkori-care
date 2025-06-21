'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'manager' | 'staff';
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  requiredRole 
}: AuthGuardProps) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 認証が必要で、ユーザーがログインしていない場合
      if (requireAuth && !user) {
        router.push('/login');
        return;
      }

      // 特定のロールが必要で、ユーザーのロールが不足している場合
      if (requiredRole && userRole) {
        const roleHierarchy = {
          'staff': 1,
          'manager': 2,
          'admin': 3,
        };

        const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
        const requiredRoleLevel = roleHierarchy[requiredRole];

        if (userRoleLevel < requiredRoleLevel) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [user, userRole, loading, requireAuth, requiredRole, router]);

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証が必要で、ユーザーがログインしていない場合は何も表示しない
  // （useEffectでリダイレクトされる）
  if (requireAuth && !user) {
    return null;
  }

  // 権限チェックが失敗した場合も何も表示しない
  if (requiredRole && userRole) {
    const roleHierarchy = {
      'staff': 1,
      'manager': 2,
      'admin': 3,
    };

    const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return null;
    }
  }

  return <>{children}</>;
}