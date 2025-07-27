'use client';

import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ClipboardList, Users, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { toastUtils } from '@/lib/toast';

interface AdminSidebarProps {
    open: boolean;
    onClose: () => void;
    pathname: string;
}

const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { href: '/admin/products', label: 'Products', icon: <ShoppingBag className="h-5 w-5 mr-2" /> },
    { href: '/admin/orders', label: 'Orders', icon: <ClipboardList className="h-5 w-5 mr-2" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="h-5 w-5 mr-2" /> },
];

export default function AdminSidebar({ open, onClose, pathname }: AdminSidebarProps) {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-200 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
                aria-hidden={!open}
            />

            {/* Sidebar */}
            <aside
                className={`
    fixed top-0 left-0 z-50 h-screen w-64 bg-white/90 backdrop-blur border-r shadow-xl
    transform transition-transform duration-200 ease-in-out
    ${open ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static
  `}
            >
                <div className="pt-24 lg:pt-10 flex flex-col h-full overflow-y-auto">
                    <nav className="flex-1 px-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center px-4 py-2 rounded-lg transition font-medium ${pathname === link.href
                                        ? 'bg-blue-100 text-blue-700 shadow'
                                        : 'text-gray-700 hover:bg-blue-50'
                                    }`}
                                onClick={onClose}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    {/* Logout button at the bottom */}
                    <div className="px-4 pb-8 mt-auto">
                        <button
                            className="flex items-center w-full px-4 py-2 rounded-lg transition font-medium text-gray-700 hover:bg-red-50 hover:text-red-700"
                            onClick={async () => {
                                try {
                                    await logout();
                                    toastUtils.success('Logged out successfully');
                                    router.push('/admin/login');
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                } catch (error: any) {
                                    toastUtils.error('Logout failed', error?.message || '');
                                }
                            }}
                        >
                            <LogOut className="h-5 w-5 mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
