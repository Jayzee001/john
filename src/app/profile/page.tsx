/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Package, Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import { shippingSchema, ShippingFormData } from '@/lib/validations';
import { useAuthStore } from '@/store/useAuthStore';
import { addressService } from '@/lib/services';
import { useOrderStore } from '@/store/useOrderStore';
import { Pagination } from '@/components/ui/pagination';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, getProfile } = useAuthStore();
  const { orders, pagination, isLoading, fetchUserOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const [editingAddress, setEditingAddress] = useState<boolean>(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressIsLoading, setAddressIsLoading] = useState(false);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchUserOrders(1, 10);
    }
  }, [activeTab, fetchUserOrders]);

  const addressForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      address: '',
      city: '',
      zipCode: '',
      country: 'USA',
    },
  });

  const handleAddressSubmit = async (data: ShippingFormData) => {
    setAddressIsLoading(true);
    try {
      const addressData = {
        street: data.address,
        city: data.city,
        postCode: data.zipCode,
        country: data.country,
      };

    if (editingAddress) {
        // Update existing address
        await addressService.updateAddress(addressData);
        toast.success('Address updated successfully!');
    } else {
        // Add new address
        await addressService.addAddress(addressData);
        toast.success('Address added successfully!');
      }

      // Refresh user data to get updated address
      await getProfile();
      
      setEditingAddress(false);
    setShowAddAddress(false);
    addressForm.reset();
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to save address';
      toast.error(message);
    } finally {
      setAddressIsLoading(false);
    }
  };

  const handleEditAddress = () => {
    if (!user?.address) return;
    
    setEditingAddress(true);
    setShowAddAddress(true);
    addressForm.reset({
      address: user.address.street || '',
      city: user.address.city || '',
      zipCode: user.address.postCode || '',
      country: user.address.country || '',
    });
  };

  const handleAddNewAddress = () => {
    setEditingAddress(false);
    setShowAddAddress(true);
    addressForm.reset();
  };

  const handleCancelAddress = () => {
    setShowAddAddress(false);
    setEditingAddress(false);
    addressForm.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  const handlePageChange = (page: number) => {
    fetchUserOrders(page, pagination.limit);
  };

  // Check if user has a valid address
  const hasValidAddress = user?.address?.street && user?.address?.city;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">My Account</h1>
            <p className="text-gray-400">Manage your profile, addresses, and orders</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 drop-shadow-md">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'profile'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <User className="inline h-4 w-4 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'addresses'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <MapPin className="inline h-4 w-4 mr-2" />
                      Addresses
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'orders'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Package className="inline h-4 w-4 mr-2" />
                      Orders
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <User className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={user.firstName || ''}
                          className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={user.lastName || ''}
                          className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={user.role}
                        className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                        readOnly
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4">
                  {showAddAddress ? (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">
                          {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Street Address</label>
                            <Input
                              {...addressForm.register('address')}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                            {addressForm.formState.errors.address && (
                              <p className="text-sm text-red-500">{addressForm.formState.errors.address.message}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">City</label>
                              <Input
                                {...addressForm.register('city')}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                              {addressForm.formState.errors.city && (
                                <p className="text-sm text-red-500">{addressForm.formState.errors.city.message}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-300">Postal Code</label>
                              <Input
                                {...addressForm.register('zipCode')}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                              {addressForm.formState.errors.zipCode && (
                                <p className="text-sm text-red-500">{addressForm.formState.errors.zipCode.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Country</label>
                            <Input
                              {...addressForm.register('country')}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                            {addressForm.formState.errors.country && (
                              <p className="text-sm text-red-500">{addressForm.formState.errors.country.message}</p>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              type="submit"
                              disabled={addressIsLoading}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {addressIsLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancelAddress}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-white">Saved Addresses</CardTitle>
                        {!hasValidAddress && (
                        <Button
                            onClick={handleAddNewAddress}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Address
                        </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        {hasValidAddress ? (
                          <div className="p-4 border-b border-gray-700 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleEditAddress}
                                  className="text-gray-300 hover:text-white hover:bg-gray-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-gray-300">
                              {user.address.street}
                              <br />
                              {user.address.city}{user.address.postCode ? `, ${user.address.postCode}` : ''}
                              <br />
                              {user.address.country}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-400">No addresses saved yet.</p>
                            <Button
                              onClick={handleAddNewAddress}
                              className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Address
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Loading orders...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <>
                      {orders.map((order) => (
                        <Card key={order.id} className="bg-white border-gray-200">
                          <CardHeader className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                              <CardTitle className="text-gray-900 text-sm sm:text-base mb-2">
                              {order.id}
                              </CardTitle>
                              <div className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)} w-fit mb-2`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 sm:p-6 pt-0">
                            <div className="space-y-3 sm:space-y-4">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 last:border-0 gap-1 sm:gap-0"
                                >
                                  <div className="flex-1 flex items-center gap-3">
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
                                      <div className="text-gray-900 font-medium text-sm sm:text-base">{item.name}</div>
                                      <div className="text-xs sm:text-sm text-gray-600">
                                        Quantity: {item.quantity}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-gray-900 font-medium text-sm sm:text-base">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                              <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-200">
                                <div className="text-gray-900 font-medium text-sm sm:text-base">Total</div>
                                <div className="text-gray-900 font-bold text-base sm:text-lg">
                                  ${order.total.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {/* Pagination */}
                      {pagination.totalPages > 1 && (
                        <div className="mt-6">
                          <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Card className="bg-white border-gray-200">
                      <CardContent className="text-center py-8">
                        <p className="text-gray-600">No orders yet.</p>
                        <Link href="/">
                          <Button className="mt-4">
                            Start Shopping
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 