/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategorySelector } from '@/components/ui/category-selector';
import { useCategoryStore } from '@/store/useCategoryStore';
import { adminProductService } from '@/lib/admin/productService';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toastUtils } from '@/lib/toast';
import { useAdminProductStore } from '@/store/useAdminProductStore';

// Form validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price is required').refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  stock: z.string().min(1, 'Stock is required').refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, 'Stock must be a non-negative number'),
  published: z.boolean(),
  featured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const { initializeCategories } = useCategoryStore();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const { deleteProductImage } = useAdminProductStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      published: true,
      featured: false,
    },
    mode: 'onChange',
  });

  // Initialize categories and load product
  useEffect(() => {
    initializeCategories();
    async function fetchProduct() {
      try {
        const data = await adminProductService.getById(productId);
        const product = data.product;
        if (product) {
          reset({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            stock: product.quantity.toString(),
            published: product.published,
            featured: product.featured,
          });
          // Set images from product.images
          setImages(
            (product.images || []).map((url: string, idx: number) => ({
              id: `existing-${idx}`,
              file: new File([], `image-${idx}.jpg`),
              preview: url,
            }))
          );
        } else {
          router.push('/admin/products');
        }
      } catch {
        setError('Failed to load product');
        router.push('/admin/products');
      } finally {
        setIsLoadingProduct(false);
      }
    }
    fetchProduct();
  }, [initializeCategories, productId, reset, router]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: ImageFile[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).slice(2, 11),
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = async (id: string) => {
    const imageToRemove = images.find(img => img.id === id);
    if (!imageToRemove) return;
    // If it's an existing image (id starts with 'existing-'), call delete API
    if (id.startsWith('existing-')) {
      try {
        await deleteProductImage(productId, imageToRemove.preview);
        setImages(prev => prev.filter(img => img.id !== id));
        toastUtils.success('Image deleted successfully');
      } catch (error: any) {
        const apiError = error?.response?.data?.error;
        const message = apiError?.details || apiError?.message || error?.message || 'Failed to delete image';
        toastUtils.error('Failed to delete image', message);
      }
    } else {
      // New image, just remove from state
      URL.revokeObjectURL(imageToRemove.preview);
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Only include new images (with real File objects)
      const newImages = images.filter(img => img.id && !img.id.startsWith('existing-'));
      const productData = {
        ...data,
        price: parseFloat(data.price),
        quantity: parseInt(data.stock),
        images: newImages, // Only new images
      };
      const result = await adminProductService.update(productId, productData);
      if (result.data && result.data.product) {
        toastUtils.success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        toastUtils.error('Error updating product', result.error?.details || result.error?.message || '');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      const apiError = error?.response?.data?.error;
      const message = apiError?.details || apiError?.message || error?.message || 'Error updating product';
      toastUtils.error('Error updating product', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/admin/products">
                <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Edit Product</h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-1">Update product information</p>
              </div>
            </div>
          </div>

          {/* Product Form */}
          <Card className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Product Name *
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter product name..."
                        className={`${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category *
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <CategorySelector
                        selectedCategory={field.value}
                        onCategoryChange={field.onChange}
                        variant="admin"
                        showAllOption={false}
                        placeholder="Select a category..."
                      />
                    )}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price *
                  </label>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={`${errors.price ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    )}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Stock Quantity *
                  </label>
                  <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="0"
                        className={`${errors.stock ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    )}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Product Images
                  </label>
                  <div className="space-y-4">
                    {/* Current Image Display */}
                    {images.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {images.map((image) => (
                            <div key={image.id} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                  src={image.preview}
                                  alt="Product preview"
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                />
                              </div>
                              {image.id !== 'current-image' && (
                                <button
                                  type="button"
                                  onClick={async () => await removeImage(image.id)}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 z-10"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload new images or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description *
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Enter product description..."
                        className={`w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          errors.description ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        rows={4}
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Published and Featured Status */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Controller
                      name="published"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            Publish product
                          </span>
                        </label>
                      )}
                    />
                    
                    <Controller
                      name="featured"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            Feature this product
                          </span>
                        </label>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <Link href="/admin/products" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto bg-white/80 backdrop-blur-sm"
                    type="button"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={!isValid || isSubmitting}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </form>
          </Card>


        </div>
      </div>
    </div>
  );
} 