/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productService } from '@/lib/productService';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';
import { Pagination } from '@/components/ui/pagination';
import { useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export default function Home() {
  const productGridRef = useRef<HTMLDivElement>(null);
  const { getCategoriesForUser, initializeCategories } = useCategoryStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0, productsPerPage: 24 });
  const { addItem } = useCartStore();

  // Initialize categories
  useEffect(() => {
    initializeCategories();
  }, [initializeCategories]);

  useEffect(() => {
    fetchProducts({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debouncedSearch === '' && searchQuery === '') {
      // Only trigger on initial mount or when cleared
      fetchProducts({ page: 1 });
    } else if (debouncedSearch.length >= 2 || debouncedSearch === '') {
      // Only search if 2+ chars or cleared
      fetchProducts({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const fetchProducts = async (params: any = {}) => {
    setLoading(true);
    try {
      // Use the category slug for API filtering
      const normalizeCategoryName = useCategoryStore.getState().normalizeCategoryName;
      const effectiveCategory = params.categoryOverride ?? selectedCategory;
      const categorySlug = effectiveCategory !== 'All' ? normalizeCategoryName(effectiveCategory) : undefined;
      const query = {
        page: params.page || pagination.currentPage,
        limit: pagination.productsPerPage,
        search: searchQuery.trim() || undefined,
        category: categorySlug,
      };
      const data = await productService.getAll(query);
      setProducts(data.products);
      setPagination(data.pagination);
      if (params.scrollToTop && productGridRef.current) {
        productGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove handleSearch and search button

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    await fetchProducts({ page: 1, scrollToTop: true, categoryOverride: category });
  };

  const handlePageChange = async (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    await fetchProducts({ page, scrollToTop: true });
  };

  const categories = getCategoriesForUser();
  const categoryNames = ['All', ...categories.map(cat => cat.name)];

  // No need to filter client-side, as API returns filtered results
  const filteredProducts = products;

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    // Show a toast or notification
    console.log(`${product.name} added to cart!`);
  };

  // Product Card Skeleton
  function ProductCardSkeleton() {
    return (
      <motion.div
        className="overflow-hidden rounded-lg bg-white shadow animate-pulse"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.5 }}
      >
        <div className="aspect-square bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mt-4" />
        </div>
      </motion.div>
    );
  }

  // Remove the full-page loading state. Always show the search/filter UI.
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // No onKeyDown needed, search is debounced
                className="pl-10 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid & Skeletons */}
        <div ref={productGridRef} />
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: pagination.productsPerPage }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available for this category or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/product/${product.id}`}>
                  <motion.div
                    className="aspect-square relative overflow-hidden"
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300"
                      priority={false}
                    />
                  </motion.div>
                </Link>
                <CardHeader className="pb-2">
                  <Link href={`/product/${product.id}`}>
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                      {product.name}
                    </CardTitle>
                  </Link>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.quantity} in stock
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full"
                    disabled={product.quantity === 0}
                  >
                    {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          scrollToId={productGridRef.current ? productGridRef.current.id : undefined}
        />
      </div>
    </div>
  );
}
