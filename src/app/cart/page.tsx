'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Trash2, ArrowLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, total, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();

  // Handle hydration
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const getSubtotal = () => {
    return total;
  };

  const getShipping = () => {
    return getSubtotal() > 100 ? 0 : 9.99;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const proceedToCheckout = () => {
    if (!user) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.push(`/auth?redirect=${redirectUrl}`);
      return;
    }
    // Here you would send the cart details to the backend
    const orderDetails = {
      items: items,
      subtotal: getSubtotal(),
      shipping: getShipping(),
      total: getTotal()
    };
    console.log('Sending order details to backend:', orderDetails);
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 text-xs md:text-sm lg:text-base">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
              <div className="w-20"></div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link href="/">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 text-xs md:text-sm lg:text-base">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
            <div className="w-20 lg:block hidden"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-full sm:w-20 h-40 sm:h-20 relative overflow-hidden rounded-lg">
                      <Image
                        src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100%, 80px"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="text-base lg:text-lg font-semibold text-white hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-500 line-clamp-2 leading-snug">
                        {item.product.description}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center sm:flex-col sm:items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right sm:text-center">
                        <p className="font-bold text-lg">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={proceedToCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                {getSubtotal() < 100 && (
                  <p className="text-sm text-gray-500 text-center">
                    Add ${(100 - getSubtotal()).toFixed(2)} more for free shipping!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 