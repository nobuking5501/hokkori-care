'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  MessageCircle,
  Settings,
  Users,
  User,
  UserCheck
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: 'admin' | 'manager' | 'staff';
}

const navigationItems: NavigationItem[] = [
  {
    name: 'ダッシュボード',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: '利用者管理',
    href: '/residents',
    icon: UserCheck,
  },
  {
    name: '支援日誌',
    href: '/support-diary',
    icon: BookOpen,
  },
  {
    name: '業務日誌',
    href: '/work-diary',
    icon: ClipboardList,
  },
  {
    name: 'マイシフト',
    href: '/my-shift',
    icon: User,
    requiredRole: 'staff',
  },
  {
    name: 'シフト管理',
    href: '/shifts',
    icon: Calendar,
    requiredRole: 'manager',
  },
  {
    name: '連絡帳',
    href: '/communication',
    icon: MessageCircle,
  },
  {
    name: 'スタッフ管理',
    href: '/users',
    icon: Users,
    requiredRole: 'manager',
  },
  {
    name: '設定',
    href: '/settings',
    icon: Settings,
    requiredRole: 'admin',
  },
];

export function Navigation() {
  const pathname = usePathname();
  const { userRole } = useAuth();
  
  console.log('Navigation userRole:', userRole);

  const hasPermission = (requiredRole?: string) => {
    if (!requiredRole) return true;
    
    const roleHierarchy = {
      'staff': 1,
      'manager': 2,
      'admin': 3,
    };

    const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy];

    return userRoleLevel >= requiredRoleLevel;
  };

  const filteredItems = navigationItems.filter(item => hasPermission(item.requiredRole));

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-4">
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                {item.name}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}