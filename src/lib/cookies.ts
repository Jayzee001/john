/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'user';

// Cookie options for security
const cookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  expires: 7, // 7 days
};

export const cookieUtils = {
  // Token management
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, cookieOptions);
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  // User data management
  setUser: (user: any) => {
    Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions);
  },

  getUser: (): any => {
    const userData = Cookies.get(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  // Clear all auth data
  clearAuth: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!Cookies.get(TOKEN_KEY);
  },
}; 