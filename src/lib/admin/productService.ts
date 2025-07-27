/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../api';

export const adminProductService = {
  // Create a new product (admin only)
  create: async (productData: any) => {
    const formData = new FormData();
    // Add up to 5 images as 'files'
    if (productData.images && Array.isArray(productData.images)) {
      productData.images.slice(0, 5).forEach((img: any) => {
        formData.append('files', img.file);
      });
    }
    // Add all other fields
    for (const key in productData) {
      if (key !== 'images' && productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    }
    const response: any = await apiClient.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  // Get product by id (admin only)
  getById: async (id: string) => {
    const response: any = await apiClient.get(`/admin/products/${id}`);
    return response.data;
  },
  // Get all products with filters and pagination (admin only)
  getAll: async (params: Record<string, any> = {}) => {
    const response: any = await apiClient.get('/admin/products', { params });
    return response.data;
  },
  // Update product by id (admin only)
  update: async (id: string, productData: any) => {
    const formData = new FormData();
    // Add up to 5 images as 'files'
    if (productData.images && Array.isArray(productData.images)) {
      productData.images.slice(0, 5).forEach((img: any) => {
        formData.append('files', img.file);
      });
    }
    // Add all other fields
    for (const key in productData) {
      if (key !== 'images' && productData[key] !== undefined && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    }
    const response: any = await apiClient.put(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
  // Delete product by id (admin only)
  delete: async (id: string) => {
    const response: any = await apiClient.delete(`/admin/products/${id}`);
    return response.data;
  },
  // Delete image from product (admin only)
  deleteImage: async (id: string, imageUrl: string) => {
    const response: any = await apiClient.delete(`/admin/products/${id}/images`, {
      data: { imageUrl },
    });
    return response.data;
  },
}; 