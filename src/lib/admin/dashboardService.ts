/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../api';

export const adminDashboardService = {
  // Get dashboard statistics (admin only)
  getStats: async () => {
    const response: any = await apiClient.get('/admin/dashboard');
    return response;
  },
}; 