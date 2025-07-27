import { LucideIcon, Smartphone, Shirt, Home, Watch, Dumbbell, Briefcase } from 'lucide-react';

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

// Static category data based on mock products
export const categories: Category[] = [
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

// Additional categories for future expansion
export const extendedCategories: Category[] = [
  ...categories,
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Equipment and gear for active lifestyles',
    icon: Dumbbell,
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

// Utility functions for category management
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getActiveCategories = (): Category[] => {
  return categories.filter(category => category.isActive);
};

export const getCategoriesForAdmin = (): Category[] => {
  return categories.sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getCategoriesForUser = (): Category[] => {
  return categories
    .filter(category => category.isActive && category.productCount > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const updateCategoryProductCount = (categoryId: string, count: number): void => {
  const category = categories.find(c => c.id === categoryId);
  if (category) {
    category.productCount = count;
  }
};

export const getCategoryDisplayName = (categoryName: string): string => {
  const category = categories.find(c => c.name === categoryName);
  return category ? category.name : categoryName;
};

export const getCategoryColor = (categoryName: string): string => {
  const category = categories.find(c => c.name === categoryName);
  return category ? category.color : 'bg-gray-500';
};

export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const category = categories.find(c => c.name === categoryName);
  return category ? category.icon : Home;
};

// Category slugs for URL routing
export const CATEGORY_SLUGS = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME_GARDEN: 'home-garden',
  ACCESSORIES: 'accessories',
  SPORTS_OUTDOORS: 'sports-outdoors',
  BOOKS_MEDIA: 'books-media',
} as const;

// Category IDs for database references
export const CATEGORY_IDS = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  HOME_GARDEN: 'home-garden',
  ACCESSORIES: 'accessories',
  SPORTS_OUTDOORS: 'sports-outdoors',
  BOOKS_MEDIA: 'books-media',
} as const;

// Category mapping for legacy support
export const CATEGORY_MAPPING: Record<string, string> = {
  'Electronics': 'electronics',
  'Clothing': 'clothing',
  'Home & Garden': 'home-garden',
  'Accessories': 'accessories',
  'Sports & Outdoors': 'sports-outdoors',
  'Books & Media': 'books-media',
};

export const normalizeCategoryName = (categoryName: string): string => {
  return CATEGORY_MAPPING[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
}; 