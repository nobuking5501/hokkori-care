'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { logout } from '@/lib/auth';
import { Menu, X, User, LogOut } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, userRole } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case 'admin':
        return '総合管理者';
      case 'manager':
        return '管理者';
      case 'staff':
        return 'スタッフ';
      default:
        return '';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-500">
              ほっこり福祉会
            </h1>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/dashboard"
              className="text-gray-600 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              ダッシュボード
            </a>
            <a
              href="/support-diary"
              className="text-gray-600 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              支援日誌
            </a>
            <a
              href="/work-diary"
              className="text-gray-600 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              業務日誌
            </a>
            {userRole === 'staff' && (
              <a
                href="/my-shift"
                className="text-gray-600 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                マイシフト
              </a>
            )}
            {(userRole === 'admin' || userRole === 'manager') && (
              <a
                href="/shifts"
                className="text-gray-600 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                シフト管理
              </a>
            )}
            <a
              href="/communication"
              className="text-gray-600 hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              連絡帳
            </a>
          </nav>

          {/* ユーザーメニュー */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 p-2 rounded-md"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">{user?.displayName}</div>
                  <div className="text-xs text-gray-500">{getRoleLabel(userRole)}</div>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.displayName}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                    <div className="text-xs text-primary-500">{getRoleLabel(userRole)}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    ログアウト
                  </button>
                </div>
              )}
            </div>

            {/* モバイルメニューボタン */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* モバイルナビゲーション */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-2">
              <a
                href="/dashboard"
                className="block px-3 py-2 text-gray-600 hover:text-primary-500 rounded-md text-base font-medium"
              >
                ダッシュボード
              </a>
              <a
                href="/support-diary"
                className="block px-3 py-2 text-gray-600 hover:text-primary-500 rounded-md text-base font-medium"
              >
                支援日誌
              </a>
              <a
                href="/work-diary"
                className="block px-3 py-2 text-gray-600 hover:text-primary-500 rounded-md text-base font-medium"
              >
                業務日誌
              </a>
              {userRole === 'staff' && (
                <a
                  href="/my-shift"
                  className="block px-3 py-2 text-gray-600 hover:text-primary-500 rounded-md text-base font-medium"
                >
                  マイシフト
                </a>
              )}
              {(userRole === 'admin' || userRole === 'manager') && (
                <a
                  href="/shifts"
                  className="block px-3 py-2 text-gray-600 hover:text-primary-500 rounded-md text-base font-medium"
                >
                  シフト管理
                </a>
              )}
              <a
                href="/communication"
                className="block px-3 py-2 text-gray-600 hover:text-primary-500 rounded-md text-base font-medium"
              >
                連絡帳
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}