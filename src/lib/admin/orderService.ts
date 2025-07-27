/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../api';

export const adminOrderService = {
  // Get all orders with pagination and filters (admin only)
  getAll: async (params: Record<string, any> = {}) => {
    const response: any = await apiClient.get('/admin/orders', { params });
    return response;
  },

  // Get single order by ID (admin only)
  getById: async (id: string) => {
    const response: any = await apiClient.get(`/admin/orders/${id}`);
    return response;
  },

  // Update order status (admin only)
  updateStatus: async (id: string, status: string) => {
    const response: any = await apiClient.patch(`/admin/orders/${id}/status`, { status });
    return response;
  },
}; 