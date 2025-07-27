import { create } from 'zustand';
import { orderService } from '@/lib/services';
import type { Order } from '@/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

interface OrderActions {
  // Fetch user orders with pagination
  fetchUserOrders: (page?: number, limit?: number) => Promise<void>;
  
  // Fetch single order
  fetchUserOrder: (id: string) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useOrderStore = create<OrderState & OrderActions>((set) => ({
  // Initial state
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },

  // Fetch user orders with pagination
  fetchUserOrders: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getUserOrders({ page, limit });
      set({
        orders: response.orders,
        pagination: {
          currentPage: response.page,
          totalPages: response.totalPages,
          total: response.total,
          limit: response.limit,
        },
        isLoading: false,
      });
    } catch {
      set({ 
        error: 'Failed to fetch orders', 
        isLoading: false 
      });
    }
  },

  // Fetch single order
  fetchUserOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await orderService.getUserOrder(id);
      set({
        currentOrder: response.order,
        isLoading: false,
      });
    } catch {
      set({ 
        error: 'Failed to fetch order', 
        isLoading: false 
      });
    }
  },

  // State management
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ 
    orders: [], 
    currentOrder: null,
    isLoading: false, 
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      limit: 10,
    }
  }),
})); 