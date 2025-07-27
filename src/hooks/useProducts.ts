import { useProductStore } from '@/store/useProductStore';
import { useCallback } from 'react';
import type { Product } from '@/types';

export const useProducts = () => {
  const {
    products,
    isLoading,
    error,
    selectedProduct,
    initializeProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductPublished,
    toggleProductFeatured,
    setSelectedProduct,
    getProductById,
    getPublishedProducts,
    getFeaturedProducts,
    getProductsByCategory,
    searchProducts,
    setLoading,
    setError,
    reset,
  } = useProductStore();

  // Enhanced product operations with error handling
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd make an API call here
      // const response = await api.createProduct(productData);
      
      // For now, add to store directly
      addProduct(productData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [addProduct, setLoading, setError]);

  const editProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd make an API call here
      // const response = await api.updateProduct(id, updates);
      
      // For now, update store directly
      updateProduct(id, updates);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [updateProduct, setLoading, setError]);

  const removeProduct = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd make an API call here
      // const response = await api.deleteProduct(id);
      
      // For now, delete from store directly
      deleteProduct(id);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [deleteProduct, setLoading, setError]);

  const togglePublished = useCallback(async (id: string) => {
    try {
      setError(null);
      toggleProductPublished(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle product status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [toggleProductPublished, setError]);

  const toggleFeatured = useCallback(async (id: string) => {
    try {
      setError(null);
      toggleProductFeatured(id);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle featured status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [toggleProductFeatured, setError]);

  // Product filtering and search
  const getProductsByCategoryWithSearch = useCallback((category: string, searchQuery?: string) => {
    let filtered = getProductsByCategory(category);
    
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    return filtered;
  }, [getProductsByCategory]);

  // Product statistics
  const getProductStats = useCallback(() => {
    const total = products.length;
    const published = products.filter(p => p.published).length;
    const drafts = products.filter(p => !p.published).length;
    const featured = products.filter(p => p.featured).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;

    return {
      total,
      published,
      drafts,
      featured,
      outOfStock,
      lowStock,
    };
  }, [products]);

  return {
    // State
    products,
    isLoading,
    error,
    selectedProduct,
    
    // Actions
    initializeProducts,
    createProduct,
    editProduct,
    removeProduct,
    togglePublished,
    toggleFeatured,
    setSelectedProduct,
    
    // Getters
    getProductById,
    getPublishedProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getProductsByCategoryWithSearch,
    searchProducts,
    getProductStats,
    
    // State management
    setLoading,
    setError,
    reset,
  };
}; 