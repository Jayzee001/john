import { create } from 'zustand';
import { productService } from '@/lib/services';
import type { Product } from '@/types';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

interface ProductActions {
  // Initialize products
  initializeProducts: () => Promise<void>;
  
  // Product CRUD operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductPublished: (id: string) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  
  // Product selection
  setSelectedProduct: (product: Product | null) => void;
  getProductById: (id: string) => Product | undefined;
  
  // Product filtering and search
  getPublishedProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProductStore = create<ProductState & ProductActions>((set, get) => ({
  // Initial state
  products: [],
  isLoading: false,
  error: null,
  selectedProduct: null,

  // Initialize products
  initializeProducts: async () => {
    set({ isLoading: true, error: null });
      try {
        const products = await productService.getAll();
        set({ products, isLoading: false });
    } catch {
      set({ error: 'Failed to load products', isLoading: false });
    }
  },

  // Product CRUD operations
  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      try {
        const newProduct = await productService.create(productData);
        set((state) => ({
          products: [...state.products, newProduct],
          isLoading: false
        }));
      } catch (apiError) {
        console.warn('API add product failed, using local state:', apiError);
        const newProduct: Product = {
          ...productData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          products: [...state.products, newProduct],
          isLoading: false
        }));
      }
    } catch {
      set({ error: 'Failed to add product', isLoading: false });
    }
  },

  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      try {
        const updatedProduct = await productService.update(id, updates);
        set((state) => ({
          products: state.products.map(product =>
            product.id === id ? updatedProduct : product
          ),
          isLoading: false
        }));
      } catch (apiError) {
        console.warn('API update product failed, using local state:', apiError);
        set((state) => ({
          products: state.products.map(product =>
            product.id === id 
              ? { ...product, ...updates, updatedAt: new Date().toISOString() }
              : product
          ),
          isLoading: false
        }));
      }
    } catch {
      set({ error: 'Failed to update product', isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      try {
        await productService.delete(id);
        set((state) => ({
          products: state.products.filter(product => product.id !== id),
          isLoading: false
        }));
      } catch (apiError) {
        console.warn('API delete product failed, using local state:', apiError);
        set((state) => ({
          products: state.products.filter(product => product.id !== id),
          isLoading: false
        }));
      }
    } catch {
      set({ error: 'Failed to delete product', isLoading: false });
    }
  },

  toggleProductPublished: async (id) => {
    const product = get().getProductById(id);
    if (!product) return;
    
    try {
      await get().updateProduct(id, { published: !product.published });
    } catch (error) {
      console.error('Failed to toggle product published status:', error);
    }
  },

  toggleProductFeatured: async (id) => {
    const product = get().getProductById(id);
    if (!product) return;
    
    try {
      await get().updateProduct(id, { featured: !product.featured });
    } catch (error) {
      console.error('Failed to toggle product featured status:', error);
    }
  },

  // Product selection
  setSelectedProduct: (product) => {
    set({ selectedProduct: product });
  },

  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },

  // Product filtering and search
  getPublishedProducts: () => {
    return get().products.filter(product => product.published);
  },

  getFeaturedProducts: () => {
    return get().products.filter(product => product.featured && product.published);
  },

  getProductsByCategory: (category) => {
    return get().products.filter(product => 
      product.category === category && product.published
    );
  },

  searchProducts: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().products.filter(product =>
      product.published && 
      (product.name.toLowerCase().includes(lowercaseQuery) || 
       product.description.toLowerCase().includes(lowercaseQuery))
    );
  },

  // State management
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ products: [], isLoading: false, error: null, selectedProduct: null }),
})); 