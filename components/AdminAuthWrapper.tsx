'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminRole, ROLE_LABELS } from '@/lib/firebase';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: AdminRole;
  name: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  hasPermission: () => false,
  refreshSession: async () => {}
});

export const useAdminAuth = () => useContext(AdminAuthContext);

interface AdminAuthWrapperProps {
  children: ReactNode;
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = useCallback(async (redirectOnFail: boolean = true) => {
    try {
      const response = await fetch('/api/admin/auth/session');
      const data = await response.json();

      if (data.authenticated) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        // Redirect to login if not authenticated and not already on login page
        if (redirectOnFail && !pathname.includes('/login')) {
          router.push('/us/tools/admin/login');
        }
        return false;
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
      if (redirectOnFail && !pathname.includes('/login')) {
        router.push('/us/tools/admin/login');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    await checkSession(false);
  }, [checkSession]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/us/tools/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions: Record<AdminRole, string[]> = {
      super_admin: ['*'],
      admin: ['seo', 'banners', 'scripts', 'users_view'],
      content_manager: ['seo', 'banners'],
      seo_manager: ['seo']
    };

    const userPermissions = permissions[user.role];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  // Skip auth check for login page
  const isLoginPage = pathname.includes('/login');

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-600 text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user && !isLoginPage) {
    return null;
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, logout, hasPermission, refreshSession }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
