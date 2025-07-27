/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { adminOrderService } from '@/lib/admin/orderService';
import type { Order } from '@/types';

interface AdminOrderState {
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

interface AdminOrderActions {
  // Fetch all orders with pagination
  fetchOrders: (page?: number, limit?: number, filters?: Record<string, any>) => Promise<void>;
  
  // Fetch single order
  fetchOrder: (id: string) => Promise<void>;
  
  // Update order status
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAdminOrderStore = create<AdminOrderState & AdminOrderActions>((set) => ({
  // Initial state
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20,
  },

  // Fetch all orders with pagination
  fetchOrders: async (page = 1, limit = 20, filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = { page, limit, ...filters };
      const response = await adminOrderService.getAll(params);
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
  fetchOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminOrderService.getById(id);
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

  // Update order status
  updateOrderStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminOrderService.updateStatus(id, status);
      // Update the order in the list
      set((state) => ({
        orders: state.orders.map(order => 
          order.id === id ? response.order : order
        ),
        currentOrder: state.currentOrder?.id === id ? response.order : state.currentOrder,
        isLoading: false,
      }));
      return response;
    } catch (error) {
      set({ 
        error: 'Failed to update order status', 
        isLoading: false 
      });
      throw error;
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
      limit: 20,
    }
  }),
})); 