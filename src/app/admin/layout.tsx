'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { cookieUtils } from '@/lib/cookies';

function isTokenExpired(token?: string): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const token = cookieUtils.getToken();
    if (
      pathname !== '/admin/login' &&
      (!token || isTokenExpired(token) || !isLoading && (!user || user.role !== 'admin'))
    ) {
      cookieUtils.clearAuth();
      router.push('/admin/login');
    }
  }, [isLoading, user, router, pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} pathname={pathname} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur shadow-sm border-b flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden mr-4"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
            </button>
            <span className="text-xl font-extrabold tracking-tight text-blue-700 flex items-center">
              John Admin
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-gray-700 font-medium">
              <span className="inline-block w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-center leading-8 font-bold mr-2">
                {(user.firstName?.[0] || user.lastName?.[0] || user.email?.[0] || '').toUpperCase()}
              </span>
              {user.firstName} {user.lastName}
            </span>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
