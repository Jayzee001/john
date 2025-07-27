'use client';

import { useState } from 'react';
import { useCategoryStore, type Category } from '@/store/useCategoryStore';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  variant?: 'admin' | 'user';
  showAllOption?: boolean;
  className?: string;
  placeholder?: string;
}

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
  variant = 'user',
  showAllOption = true,
  className = '',
  placeholder = 'Select category...'
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { getCategoriesForAdmin, getCategoriesForUser } = useCategoryStore();
  const categories = variant === 'admin' ? getCategoriesForAdmin() : getCategoriesForUser();
  const options = showAllOption ? ['all', ...categories.map(cat => cat.name)] : categories.map(cat => cat.name);
  
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left"
      >
        <span className="block truncate text-black">
          {selectedCategory === 'all' ? 'All Categories' : selectedCategory || placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                onCategoryChange(category);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                selectedCategory === category ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  className?: string;
}

export function CategoryCard({ category, onClick, className = '' }: CategoryCardProps) {
  const IconComponent = category.icon;
  
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${category.color}`}>
          <IconComponent className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{category.name}</h3>
          <p className="text-sm text-gray-500">{category.description}</p>
          <p className="text-xs text-gray-400 mt-1">{category.productCount} products</p>
        </div>
      </div>
    </div>
  );
}

interface CategoryListProps {
  variant?: 'admin' | 'user';
  onCategorySelect?: (category: Category) => void;
  className?: string;
}

export function CategoryList({ variant = 'user', onCategorySelect, className = '' }: CategoryListProps) {
  const { getCategoriesForAdmin, getCategoriesForUser } = useCategoryStore();
  const categories = variant === 'admin' ? getCategoriesForAdmin() : getCategoriesForUser();
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={() => onCategorySelect?.(category)}
        />
      ))}
    </div>
  );
} 