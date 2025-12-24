'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Perform logout
    const performLogout = async () => {
      try {
        await fetch('/api/admin/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Redirect to login page
        router.push('/us/tools/admin/login');
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Logging out...</p>
      </div>
    </div>
  );
}
