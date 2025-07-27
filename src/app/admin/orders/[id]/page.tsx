'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import Link from 'next/link';
import type { OrderStatus } from '@/types';
import { useState, useEffect } from 'react';
import { useAdminOrderStore } from '@/store/useAdminOrderStore';
import { toast } from 'sonner';
import Image from 'next/image';

const statusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { currentOrder, isLoading, error, fetchOrder, updateOrderStatus } = useAdminOrderStore();
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Fetch order details on component mount
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

  // Update local status when order data is loaded
  useEffect(() => {
    if (currentOrder) {
      setStatus(currentOrder.status as OrderStatus);
    }
  }, [currentOrder]);

  // Handle status update
  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!currentOrder) return;
    
    setStatusUpdateLoading(true);
    try {
      await updateOrderStatus(currentOrder.id, newStatus);
      toast.success('Order status updated successfully!');
      setStatus(newStatus);
    } catch {
      toast.error('Failed to update order status');
      // Revert to original status on error
      setStatus(currentOrder.status as OrderStatus);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8 text-black">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button variant="outline">Back</Button>
            </Link>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
          <Card className="p-6 space-y-6 bg-white border border-gray-300">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 text-black">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
          <Card className="p-6 bg-white border border-gray-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Order</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchOrder(orderId)}>Try Again</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Order not found
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-white py-8 text-black">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
          <Card className="p-6 bg-white border border-gray-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
              <p className="text-gray-600 mb-4">The order you&apos;re looking for doesn&apos;t exist.</p>
              <Button onClick={() => router.push('/admin/orders')}>Back to Orders</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const order = currentOrder;
  const address = order.address;

  return (
    <div className="min-h-screen bg-white py-8 text-black">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="outline">Back</Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            Order #{order.id.length > 20 ? order.id.substring(0, 20) + '...' : order.id}
          </h1>
        </div>
        <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white border border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="font-semibold text-gray-800 mb-2">Customer</h2>
              <p className="text-gray-900 break-all">{order.customerEmail}</p>
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-1">Shipping Address</h3>
                <p className="text-gray-700 text-sm">{address.street}</p>
                <p className="text-gray-700 text-sm">{address.city}, {address.postCode}</p>
                <p className="text-gray-700 text-sm">{address.country}</p>
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 mb-2">Order Info</h2>
              <div className="mb-2">
                <span className="font-medium">Status:</span>{' '}
                <Select
                  value={status}
                  onValueChange={(value) => handleStatusUpdate(value as OrderStatus)}
                  options={statusOptions.map(status => ({
                    value: status,
                    label: status.charAt(0).toUpperCase() + status.slice(1)
                  }))}
                  className="inline-block w-32 sm:w-40"
                  disabled={statusUpdateLoading}
                />
              </div>
              <p className="text-sm sm:text-base"><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Last Update:</span> {new Date(order.updatedAt).toLocaleDateString()}</p>
              <p className="text-sm sm:text-base"><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Items</h2>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={index} className="py-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-900">
                  <div className="flex items-center gap-3 flex-1">
                    {item.images && item.images.length > 0 && (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-md border border-gray-200"
                      />
                    )}
                    <div>
                      <span className="font-medium text-sm sm:text-base">{item.name}</span>
                      <div className="text-xs sm:text-sm text-gray-500">x{item.quantity}</div>
                    </div>
                  </div>
                  <span className="text-gray-900 font-medium text-sm sm:text-base sm:ml-auto">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
} 