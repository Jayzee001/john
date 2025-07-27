/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategorySelector } from '@/components/ui/category-selector';
import Link from 'next/link';
import Image from 'next/image';
import { useCategoryStore } from '@/store/useCategoryStore';
import { adminProductService } from '@/lib/admin/productService';
import { Product, ProductListResponse } from '@/types';
import { Edit, Eye, EyeOff, Trash2, Star } from 'lucide-react';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmationModal';
import { useAdminProductStore } from '@/store/useAdminProductStore';
import { Pagination } from '@/components/ui/pagination';
import { toastUtils } from '@/lib/toast';

export default function AdminProducts() {
  const { initializeCategories } = useCategoryStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0, productsPerPage: 20 });
  const { deleteProduct, updateProduct } = useAdminProductStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  // Add state for confirmation modal for publish/feature actions
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionProduct, setActionProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<'publish'|'unpublish'|'feature'|'unfeature'|null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Initialize categories
  useEffect(() => {
    initializeCategories();
  }, [initializeCategories]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: pagination.currentPage,
        limit: pagination.productsPerPage,
      };
      if (searchTerm.length >= 2) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const data: ProductListResponse = await adminProductService.getAll(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      // setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.productsPerPage, searchTerm, selectedCategory]);
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, pagination.currentPage, pagination.productsPerPage, fetchProducts]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Skeleton loader for table rows
  function TableSkeleton({ rows = 5, cols = 7 }) {
    return Array.from({ length: rows }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="px-3 lg:px-6 py-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          </td>
        ))}
      </tr>
    ));
  }
  // Skeleton loader for cards
  function CardSkeleton() {
    return (
      <Card className="p-4 lg:p-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mx-auto mb-2" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3 mx-auto" />
      </Card>
    );
  }

  // Helper to open modal for publish/feature actions
  const openActionModal = (product: Product, type: 'publish'|'unpublish'|'feature'|'unfeature') => {
    setActionProduct(product);
    setActionType(type);
    setActionModalOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-1">Manage your store&apos;s products</p>
        </div>
        <Link href="/admin/products/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              variant="admin"
              showAllOption={true}
            />
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-4 lg:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="hidden sm:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="hidden sm:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="hidden md:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? TableSkeleton({ rows: pagination.productsPerPage, cols: 7 })
                : filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10 relative">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            className="rounded-lg object-cover"
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 32px, 40px"
                          />
                        ) : (
                          <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg bg-gray-200" />
                        )}
                      </div>
                      <div className="ml-3 lg:ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {product.category} • ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="hidden sm:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.quantity}
                  </td>
                  <td className="hidden md:table-cell px-3 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-3 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.featured
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.featured ? 'Featured' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1 lg:space-x-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm" title="Edit product" className="p-1 lg:p-2">
                          <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openActionModal(product, product.published ? 'unpublish' : 'publish')}
                        title={product.published ? 'Unpublish product' : 'Publish product'}
                        className="p-1 lg:p-2"
                      >
                        {product.published ? (
                          <EyeOff className="h-3 w-3 lg:h-4 lg:w-4" />
                        ) : (
                          <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openActionModal(product, product.featured ? 'unfeature' : 'feature')}
                        title={product.featured ? 'Remove from featured' : 'Add to featured'}
                        className={`p-1 lg:p-2 ${product.featured ? 'text-yellow-600 hover:text-yellow-800' : ''}`}
                      >
                        <Star className={`h-3 w-3 lg:h-4 lg:w-4 ${product.featured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProductToDelete(product);
                          setDeleteModalOpen(true);
                        }}
                        title="Delete product"
                        className="text-red-600 hover:text-red-800 p-1 lg:p-2"
                      >
                        <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : (
            <>
              <Card className="p-4 lg:p-6 bg-white text-gray-900">
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{pagination.totalProducts}</p>
                  <p className="text-xs lg:text-sm text-gray-600">Total Products</p>
                </div>
              </Card>
              <Card className="p-4 lg:p-6 bg-white text-gray-900">
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-green-600">
                    {products.filter(p => p.published).length}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">Published</p>
                </div>
              </Card>
              <Card className="p-4 lg:p-6 bg-white text-gray-900">
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-gray-600">
                    {products.filter(p => !p.published).length}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">Drafts</p>
                </div>
              </Card>
              <Card className="p-4 lg:p-6 bg-white text-gray-900">
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-red-600">
                    {products.filter(p => p.quantity === 0).length}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">Out of Stock</p>
                </div>
              </Card>
              <Card className="p-4 lg:p-6 bg-white text-gray-900">
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-yellow-600">
                    {products.filter(p => p.featured).length}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">Featured</p>
                </div>
              </Card>
            </>
          )}
      </div>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(p) => {
          setLoading(true);
          setPagination((prev) => ({ ...prev, currentPage: p }));
          setTimeout(() => setLoading(false), 500); // Optionally keep loading for a short time
        }}
      />
      {/* Action Confirmation Modal for publish/feature */}
      <DeleteConfirmationModal
        open={actionModalOpen}
        onOpenChange={setActionModalOpen}
        onConfirm={async () => {
          if (!actionProduct || !actionType) return;
          setActionLoading(true);
          try {
            if (actionType === 'publish' || actionType === 'unpublish') {
              await updateProduct(actionProduct.id, { published: actionType === 'publish' });
              toastUtils.success(`Product ${actionType === 'publish' ? 'published' : 'unpublished'} successfully!`);
            } else if (actionType === 'feature' || actionType === 'unfeature') {
              await updateProduct(actionProduct.id, { featured: actionType === 'feature' });
              toastUtils.success(`Product ${actionType === 'feature' ? 'featured' : 'unfeatured'} successfully!`);
            }
            await fetchProducts();
            setActionModalOpen(false);
            setActionProduct(null);
            setActionType(null);
            // Optionally re-fetch products here
          } catch (error: any) {
            const apiError = error?.response?.data?.error;
            const message = apiError?.details || apiError?.message || error?.message || 'Action failed';
            toastUtils.error('Action failed', message);
          } finally {
            setActionLoading(false);
          }
        }}
        title={
          actionType === 'publish' ? 'Publish Product'
          : actionType === 'unpublish' ? 'Unpublish Product'
          : actionType === 'feature' ? 'Feature Product'
          : actionType === 'unfeature' ? 'Unfeature Product'
          : ''
        }
        description={
          actionType === 'publish' ? `Are you sure you want to publish "${actionProduct?.name}"?`
          : actionType === 'unpublish' ? `Are you sure you want to unpublish "${actionProduct?.name}"?`
          : actionType === 'feature' ? `Are you sure you want to feature "${actionProduct?.name}"?`
          : actionType === 'unfeature' ? `Are you sure you want to unfeature "${actionProduct?.name}"?`
          : ''
        }
        loading={actionLoading}
      />
      {/* Delete Confirmation Modal (already present) */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={async () => {
          if (productToDelete) {
            try {
              await deleteProduct(productToDelete.id);
              toastUtils.success('Product deleted successfully!');
              await fetchProducts();
            } catch (error: any) {
              const apiError = error?.response?.data?.error;
              const message = apiError?.details || apiError?.message || error?.message || 'Delete failed';
              toastUtils.error('Delete failed', message);
            }
            setDeleteModalOpen(false);
            setProductToDelete(null);
            // Optionally re-fetch products here
          }
        }}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
} 