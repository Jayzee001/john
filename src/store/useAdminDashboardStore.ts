import { create } from 'zustand';
import { adminDashboardService } from '@/lib/admin/dashboardService';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  publishedProducts: number;
  pendingOrders: number;
  orderStatus: {
    completed: number;
    pending: number;
    processing: number;
    confirmed: number;
    out_for_delivery: number;
    cancelled: number;
  };
  productStatus: {
    published: number;
    draft: number;
  };
}

interface AdminDashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

interface AdminDashboardActions {
  // Fetch dashboard statistics
  fetchStats: () => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAdminDashboardStore = create<AdminDashboardState & AdminDashboardActions>((set) => ({
  // Initial state
  stats: null,
  isLoading: false,
  error: null,

  // Fetch dashboard statistics
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminDashboardService.getStats();
      set({
        stats: response.data,
        isLoading: false,
      });
    } catch {
      set({ 
        error: 'Failed to fetch dashboard statistics', 
        isLoading: false 
      });
    }
  },

  // State management
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ 
    stats: null,
    isLoading: false, 
    error: null
  }),
})); 