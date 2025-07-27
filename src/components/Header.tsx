'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, User, Menu as MenuIcon, X, ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authToast } from '@/lib/toast';

export function Header() {
    const { user, logout } = useAuthStore();
    const { items } = useCartStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = async () => {
        try {
            await logout();
            authToast.logoutSuccess();
        } catch (error) {
            console.error('Logout failed:', error);
            authToast.logoutError('Failed to logout. Please try again.');
        }
    };

    const handleAuthClick = (type: 'login' | 'signup') => {
        router.push(`/auth${type === 'signup' ? '?tab=signup' : ''}`);
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        John Store
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="block md:hidden p-2 rounded-md hover:bg-gray-100"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6 text-gray-600" />
                        ) : (
                            <MenuIcon className="h-6 w-6 text-gray-600" />
                        )}
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <Link href="/cart">
                            <Button variant="outline" size="sm" className="cursor-pointer">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Cart ({itemCount})
                            </Button>
                        </Link>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name || `${user.firstName} ${user.lastName}`}
                                                width={24}
                                                height={24}
                                                className="h-6 w-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-4 w-4" />
                                        )}
                                        <span>{user.name || `${user.firstName} ${user.lastName}`}</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="w-full">
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleAuthClick('login')}>
                                    Login
                                </Button>
                                <Button size="sm" onClick={() => handleAuthClick('signup')}>
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>

                {/* Mobile Navigation Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-50" onClick={() => setIsMobileMenuOpen(false)}>
                        <div 
                            className="absolute right-0 top-0 h-screen w-64 bg-white shadow-lg py-4"
                            onClick={e => e.stopPropagation()}
                        >
                            {user ? (
                                <div className="px-4 py-2 space-y-2 text-black">
                                    <div className="flex items-center space-x-2 px-4 py-2 border-b">
                                        {user.image ? (
                                            <Image
                                                src={user.image}
                                                alt={user.name || `${user.firstName} ${user.lastName}`}
                                                width={32}
                                                height={32}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-5 w-5" />
                                        )}
                                        <span className="font-medium">{user.name || `${user.firstName} ${user.lastName}`}</span>
                                    </div>
                                    <Link
                                        href="/cart"
                                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-md"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <ShoppingCart className="h-5 w-5" />
                                            <span>Cart</span>
                                        </div>
                                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-sm">
                                            {itemCount}
                                        </span>
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
                                    </Link>
                                    
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="px-4 py-2 space-y-2">
                                    <Link
                                        href="/cart"
                                        className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-md border-b border-gray-100 mb-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <ShoppingCart className="h-5 w-5 text-gray-600" />
                                            <span className="text-gray-600">Cart</span>
                                        </div>
                                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-sm">
                                            {itemCount}
                                        </span>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            handleAuthClick('login');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            handleAuthClick('signup');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
} 