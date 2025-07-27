'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAdminDashboardStore } from '@/store/useAdminDashboardStore';

export default function AdminDashboard() {
  const { stats, isLoading, error, fetchStats } = useAdminDashboardStore();

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your store&apos;s performance</p>
        </div>
        
        {/* Loading skeleton for stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6 bg-white">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your store&apos;s performance</p>
        </div>
        
        <Card className="p-6 bg-white">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchStats}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  // No stats available
  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your store&apos;s performance</p>
        </div>
        
        <Card className="p-6 bg-white">
          <div className="text-center">
            <p className="text-gray-600">No dashboard data available.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your store&apos;s performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white text-gray-900">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white text-gray-900">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white text-gray-900">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              <p className="text-sm text-gray-500">{stats.publishedProducts} published</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white text-gray-900">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white text-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/products/new">
              <Button className="w-full mb-2" variant="outline">
                Add New Product
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button className="w-full mb-2" variant="outline">
                View Orders
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button className="w-full mb-2" variant="outline">
                Manage Users
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 bg-white text-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium">{stats.orderStatus.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Confirmed</span>
              <span className="text-sm font-medium">{stats.orderStatus.confirmed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Processing</span>
              <span className="text-sm font-medium">{stats.orderStatus.processing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Out for Delivery</span>
              <span className="text-sm font-medium">{stats.orderStatus.out_for_delivery}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium">{stats.orderStatus.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cancelled</span>
              <span className="text-sm font-medium">{stats.orderStatus.cancelled}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white text-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Published</span>
              <span className="text-sm font-medium">{stats.productStatus.published}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Draft</span>
              <span className="text-sm font-medium">{stats.productStatus.draft}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 