import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Check if user is authenticated and has admin role
    const user = request.cookies.get('user');
    
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const userData = JSON.parse(user.value);
      if (userData.role !== 'admin') {
        // Redirect to login if not admin
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch {
      // Invalid user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
  ],
}; 