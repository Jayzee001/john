"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Toaster } from 'sonner';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isAdminRoute && !isLoginPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && !isLoginPage && <Footer />}
      <Toaster position="top-right" expand={true} richColors />
    </>
  );
} 