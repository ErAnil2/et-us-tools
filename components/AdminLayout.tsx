'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  user?: { name: string; email: string; role: string } | null;
}

export default function AdminLayout({ children, title, user }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/us/tools/admin/dashboard', label: 'Dashboard', tab: 'dashboard' },
    { href: '/us/tools/admin/seo-management', label: 'SEO (Firebase)', tab: 'seo-management' },
    { href: '/us/tools/admin/seo-content', label: 'SEO Content', tab: 'seo-content' },
    { href: '/us/tools/admin/faq-management', label: 'FAQs', tab: 'faqs' },
    { href: '/us/tools/admin/analytics', label: 'Analytics', tab: 'analytics' },
    { href: '/us/tools/admin/content-management', label: 'Content', tab: 'content' },
    { href: '/us/tools/admin/pages', label: 'Pages', tab: 'pages' },
    { href: '/us/tools/admin/banner-management', label: 'Banners', tab: 'banners' },
    { href: '/us/tools/admin/global-scripts', label: 'Scripts', tab: 'scripts' },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  <svg className="w-8 h-8 text-blue-600 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                  </svg>
                  The Economic Times Admin
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user?.name || user?.email || 'Admin'}
                </span>
                <Link
                  href="/us/tools/admin/logout"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-600 hover:bg-red-50"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 overflow-x-auto">
            <div className="flex space-x-4 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}
