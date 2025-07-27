import { apiClient } from './api';
import { ProductListResponse, ProductDetailResponse } from '@/types';

export const productService = {
  // Get all products with filters, pagination, and sorting
  getAll: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    search?: string;
  } = {}): Promise<ProductListResponse> => {
    const response = await apiClient.get<{ success: boolean; data: ProductListResponse }>(
      '/products',
      { params }
    );
    return response.data;
  },

  // Get product by ID
  getById: async (id: string): Promise<ProductDetailResponse> => {
    const response = await apiClient.get<{ success: boolean; data: ProductDetailResponse }>(
      `/products/${id}`
    );
    return response.data;
  },
}; 