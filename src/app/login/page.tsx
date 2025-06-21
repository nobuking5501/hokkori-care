'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInWithEmail, createUserWithEmail } from '@/lib/auth';
import { useAuth } from '@/components/providers';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('nobuking5501@gmail.com');
  const [password, setPassword] = useState('hokkori2024');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // 既にログインしている場合はダッシュボードへリダイレクト
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('ログインに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Login attempt:', { email, password, isSignUp });
      
      if (isSignUp) {
        await createUserWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Email login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'ログインに失敗しました。';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'ユーザーが見つかりません。';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'パスワードが間違っています。';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に使用されています。';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードは6文字以上で入力してください。';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '有効なメールアドレスを入力してください。';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'ログイン試行回数が多いため、一時的にブロックされています。しばらくお待ちください。';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'ネットワーク接続を確認してください。';
      } else {
        errorMessage = `ログインエラー: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F0F0' }}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#009999' }}>
            ほっこり福祉会
          </h1>
          <p className="text-gray-600">業務支援アプリ</p>
        </div>
        
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ログイン
            </h2>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* メール/パスワードログインフォーム */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
                style={{}}
                placeholder="メールアドレスを入力"
                defaultValue="nobuking5501@gmail.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
                  style={{}}
                  placeholder="パスワードを入力"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Toggle password visibility, current state:', showPassword);
                    setShowPassword(prev => {
                      console.log('Setting showPassword to:', !prev);
                      return !prev;
                    });
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "パスワードを非表示" : "パスワードを表示"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878A3 3 0 0112 9a3 3 0 012.121.879M9.878 9.878l4.242 4.242m0-4.242a9.02 9.02 0 005.16-1.31m0 0a9.02 9.02 0 002.16-6.69m-6.32 9a8.46 8.46 0 01-2.16-6.69" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                backgroundColor: loading ? '#007a7a' : '#009999'
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#007a7a')}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#009999')}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'アカウント作成中...' : 'ログイン中...'}
                </div>
              ) : (
                isSignUp ? 'アカウントを作成' : 'ログイン'
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm hover:underline"
              style={{ color: '#009999' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#007a7a'}
              onMouseOut={(e) => e.currentTarget.style.color = '#009999'}
            >
              {isSignUp ? 'ログインはこちら' : 'アカウント作成はこちら'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{}}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: '#009999' }}></div>
                ログイン中...
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Googleでサインイン
              </div>
            )}
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500">
          <p>システムご利用には管理者による承認が必要です</p>
        </div>
      </div>
    </div>
  );
}