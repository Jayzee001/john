import { create } from 'zustand';
import { LucideIcon, Smartphone, Shirt, Home, Watch, Briefcase } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  color: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface CategoryActions {
  // Initialize categories
  initializeCategories: () => void;
  
  // Category CRUD operations
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryActive: (id: string) => void;
  
  // Product count management
  updateProductCount: (categoryId: string, count: number) => void;
  refreshAllProductCounts: (products: { category: string }[]) => void;
  
  // Getters
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getActiveCategories: () => Category[];
  getCategoriesForAdmin: () => Category[];
  getCategoriesForUser: () => Category[];
  
  // Utility functions
  getCategoryDisplayName: (categoryName: string) => string;
  getCategoryColor: (categoryName: string) => string;
  getCategoryIcon: (categoryName: string) => LucideIcon;
  normalizeCategoryName: (categoryName: string) => string;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Initial categories data
const initialCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets and electronic devices',
    icon: Smartphone,
    color: 'bg-blue-500',
    productCount: 3, // Based on mock data: Wireless Headphones, Smart Watch, Wireless Charging Pad
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for all occasions',
    icon: Shirt,
    color: 'bg-purple-500',
    productCount: 1, // Based on mock data: Organic Cotton T-Shirt
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and outdoor space',
    icon: Home,
    color: 'bg-green-500',
    productCount: 1, // Based on mock data: Stainless Steel Water Bottle
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Essential accessories and lifestyle products',
    icon: Watch,
    color: 'bg-orange-500',
    productCount: 1, // Based on mock data: Leather Wallet
    isActive: true,
    sortOrder: 4,
  },
];

// Extended categories for future expansion
const extendedCategories: Category[] = [
  ...initialCategories,
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Equipment and gear for active lifestyles',
    icon: Watch,
    color: 'bg-red-500',
    productCount: 0,
    isActive: false,
    sortOrder: 5,
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, and digital content',
    icon: Briefcase,
    color: 'bg-indigo-500',
    productCount: 0,
    isActive: false,
    sortOrder: 6,
  },
];

// Category mapping for legacy support
const CATEGORY_MAPPING: Record<string, string> = {
  'Electronics': 'electronics',
  'Clothing': 'clothing',
  'Home & Garden': 'home-garden',
  'Accessories': 'accessories',
  'Sports & Outdoors': 'sports-outdoors',
  'Books & Media': 'books-media',
};

export const useCategoryStore = create<CategoryState & CategoryActions>((set, get) => ({
  // Initial state
  categories: [],
  isLoading: false,
  error: null,

  // Initialize categories
  initializeCategories: () => {
    set({ categories: initialCategories, isLoading: false, error: null });
  },

  // Category CRUD operations
  addCategory: (category) => {
    const newCategory: Category = {
      ...category,
      id: category.slug, // Use slug as ID for consistency
    };
    set((state) => ({
      categories: [...state.categories, newCategory].sort((a, b) => a.sortOrder - b.sortOrder)
    }));
  },

  updateCategory: (id, updates) => {
    set((state) => ({
      categories: state.categories.map(category =>
        category.id === id ? { ...category, ...updates } : category
      )
    }));
  },

  deleteCategory: (id) => {
    set((state) => ({
      categories: state.categories.filter(category => category.id !== id)
    }));
  },

  toggleCategoryActive: (id) => {
    set((state) => ({
      categories: state.categories.map(category =>
        category.id === id ? { ...category, isActive: !category.isActive } : category
      )
    }));
  },

  // Product count management
  updateProductCount: (categoryId, count) => {
    set((state) => ({
      categories: state.categories.map(category =>
        category.id === categoryId ? { ...category, productCount: count } : category
      )
    }));
  },

  refreshAllProductCounts: (products) => {
    set((state) => ({
      categories: state.categories.map(category => {
        const count = products.filter((p: { category: string }) => p.category === category.name).length;
        return { ...category, productCount: count };
      })
    }));
  },

  // Getters
  getCategoryById: (id) => {
    return get().categories.find(category => category.id === id);
  },

  getCategoryBySlug: (slug) => {
    return get().categories.find(category => category.slug === slug);
  },

  getActiveCategories: () => {
    return get().categories.filter(category => category.isActive);
  },

  getCategoriesForAdmin: () => {
    return get().categories.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  getCategoriesForUser: () => {
    return get().categories
      .filter(category => category.isActive && category.productCount > 0)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  // Utility functions
  getCategoryDisplayName: (categoryName) => {
    const category = get().categories.find(c => c.name === categoryName);
    return category ? category.name : categoryName;
  },

  getCategoryColor: (categoryName) => {
    const category = get().categories.find(c => c.name === categoryName);
    return category ? category.color : 'bg-gray-500';
  },

  getCategoryIcon: (categoryName) => {
    const category = get().categories.find(c => c.name === categoryName);
    return category ? category.icon : Home;
  },

  normalizeCategoryName: (categoryName) => {
    return CATEGORY_MAPPING[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  },

  // State management
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ categories: [], isLoading: false, error: null }),
}));

// Export constants for convenience
export const CATEGORY_SLUGS = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME_GARDEN: 'home-garden',
  ACCESSORIES: 'accessories',
  SPORTS_OUTDOORS: 'sports-outdoors',
  BOOKS_MEDIA: 'books-media',
} as const;

export const CATEGORY_IDS = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME_GARDEN: 'home-garden',
  ACCESSORIES: 'accessories',
  SPORTS_OUTDOORS: 'sports-outdoors',
  BOOKS_MEDIA: 'books-media',
} as const;

// Legacy exports for backward compatibility
export const categories = initialCategories;
export { extendedCategories, CATEGORY_MAPPING }; 