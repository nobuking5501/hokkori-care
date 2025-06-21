'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Header } from '@/components/header';
import { Navigation } from '@/components/navigation';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'manager' | 'staff';
  showNavigation?: boolean;
}

export function Layout({ 
  children, 
  requireAuth = true,
  requiredRole,
  showNavigation = true 
}: LayoutProps) {
  return (
    <AuthGuard requireAuth={requireAuth} requiredRole={requiredRole}>
      <div className="min-h-screen bg-secondary">
        <Header />
        <div className="flex">
          {showNavigation && (
            <aside className="hidden md:block w-64 min-h-screen">
              <Navigation />
            </aside>
          )}
          <main className={`flex-1 ${showNavigation ? 'md:ml-0' : ''}`}>
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}