/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { adminProductService } from '@/lib/admin/productService';

interface AdminProductState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  createProduct: (productData: any) => Promise<any>;
  updateProduct: (id: string, productData: any) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
  deleteProductImage: (id: string, imageUrl: string) => Promise<any>;
}

export const useAdminProductStore = create<AdminProductState>((set) => ({
  isLoading: false,
  error: null,
  success: false,

  createProduct: async (productData) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const result = await adminProductService.create(productData);
      set({ isLoading: false, error: null, success: true });
      return result;
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || 'Failed to create product', success: false });
      throw error;
    }
  },
  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const result = await adminProductService.update(id, productData);
      set({ isLoading: false, error: null, success: true });
      return result;
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || 'Failed to update product', success: false });
      throw error;
    }
  },
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const result = await adminProductService.delete(id);
      set({ isLoading: false, error: null, success: true });
      return result;
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || 'Failed to delete product', success: false });
      throw error;
    }
  },
  deleteProductImage: async (id, imageUrl) => {
    set({ isLoading: true, error: null, success: false });
    try {
      const result = await adminProductService.deleteImage(id, imageUrl);
      set({ isLoading: false, error: null, success: true });
      return result;
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || 'Failed to delete image', success: false });
      throw error;
    }
  },
})); 