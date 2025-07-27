/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../api';

export const adminUserService = {
  // Search users with query params (admin only)
  searchUsers: async (params: Record<string, any>, returnFullResponse = false) => {
    const response: any = await apiClient.get('/admin/users/search', { params });
    // The API returns { success, data: { users, pagination, filters, ... } }
    if (returnFullResponse) return response.data;
    return response.data.users;
  },
  // Get user details by ID (admin only)
  getUserById: async (id: string) => {
    const response: any = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },
}; 