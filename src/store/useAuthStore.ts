
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/services';
import { cookieUtils } from '@/lib/cookies';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  role: 'customer' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  // Legacy support
  name?: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,

      initializeAuth: async () => {
        try {
          // Check if we have a token
          const token = cookieUtils.getToken();
          if (token) {
            // Try to get user profile
            await get().getProfile();
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          // Clear invalid auth data
          cookieUtils.clearAuth();
          set({ user: null, isLoading: false });
        }
      },

      getProfile: async () => {
        try {
          const response = await authService.getProfile();
          const user = response.data.user;
          
          // Add legacy name field for compatibility
          const userWithLegacy = {
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          };
          
          set({ user: userWithLegacy });
          cookieUtils.setUser(userWithLegacy);
        } catch (error) {
          console.error('Failed to get profile:', error);
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        try {
          // Basic validation
          if (!email || !password) {
            throw new Error('Email and password are required');
          }

          const response = await authService.login(email, password);
          // Store token in cookies
          cookieUtils.setToken(response.data.token);

          // Fetch user profile after login to ensure it's up-to-date
          await get().getProfile();
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      signup: async (firstName: string, lastName: string, email: string, password: string) => {
        try {
          // Basic validation
          if (!firstName || !lastName || !email || !password) {
            throw new Error('All fields are required');
          }

          const response = await authService.signup(firstName, lastName, email, password);
          // Store token in cookies
          cookieUtils.setToken(response.data.token);
          // Fetch user profile after signup to ensure it's up-to-date
          await get().getProfile();
        } catch (error) {
          console.error('Signup failed:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          // Try API logout
          try {
            await authService.logout();
          } catch (apiError) {
            console.warn('API logout failed:', apiError);
          }
          // Clear all auth data
          cookieUtils.clearAuth();
          set({ user: null });
        } catch (error) {
          console.error('Logout failed:', error);
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.isLoading) {
          state.isLoading = false;
        }
      }
    }
  )
); 