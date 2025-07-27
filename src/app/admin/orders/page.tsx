/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { OrderStatus } from '@/types';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { useAdminOrderStore } from '@/store/useAdminOrderStore';
import { Pagination } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

const statusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

export default function AdminOrders() {
  const { orders, pagination, isLoading, fetchOrders, updateOrderStatus } = useAdminOrderStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // Fetch orders when search, status, or debounced search changes
  useEffect(() => {
    const filters: Record<string, any> = {};
    if (debouncedSearch) filters.search = debouncedSearch;
    if (status !== 'all') filters.status = status;
    fetchOrders(1, 20, filters);
  }, [debouncedSearch, status, fetchOrders]);

  // Handle page change
  const handlePageChange = (page: number) => {
    const filters: Record<string, any> = {};
    if (debouncedSearch) filters.search = debouncedSearch;
    if (status !== 'all') filters.status = status;
    fetchOrders(page, 20, filters);
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setStatusUpdateLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully!');
      setSelectedOrder(null);
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate totals
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  // const confirmedOrders = orders.filter(order => order.status === 'confirmed').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

  // Skeleton loader for table rows
  function TableSkeleton({ rows = 5, cols = 6 }) {
    return Array.from({ length: rows }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and track fulfillment</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </Card>
        <Card className="p-6 bg-white">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </Card>
        <Card className="p-6 bg-white">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            <p className="text-sm text-gray-600">Pending Orders</p>
          </div>
        </Card>
        <Card className="p-6 bg-white">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
            <p className="text-sm text-gray-600">Delivered Orders</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <Input
              type="text"
              placeholder="Search by customer email or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as OrderStatus | 'all')}
              options={[
                { value: 'all', label: 'All Statuses' },
                ...statusOptions.map(status => ({
                  value: status,
                  label: status.charAt(0).toUpperCase() + status.slice(1)
                }))
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading
                ? TableSkeleton({ rows: 10, cols: 7 })
                : orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {selectedOrder === order.id ? (
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                          options={statusOptions.map(status => ({
                            value: status,
                            label: status.charAt(0).toUpperCase() + status.slice(1)
                          }))}
                          className="w-32"
                        />
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order.id)}
                          disabled={statusUpdateLoading}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!isLoading && orders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found matching your criteria.</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
} 