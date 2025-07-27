'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { shippingSchema, ShippingFormData } from '@/lib/validations';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { checkoutService } from '@/lib/services';

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const { items, itemCount } = useCartStore();

  // Hydration check for Zustand persist
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(useCartStore.persist.hasHydrated());
    const unsubHydrate = useCartStore.persist.onHydrate(() => setHasHydrated(false));
    const unsubFinish = useCartStore.persist.onFinishHydration(() => setHasHydrated(true));
    return () => {
      unsubHydrate();
      unsubFinish();
    };
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user && hasHydrated) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth?redirect=${redirectUrl}`;
    }
  }, [user, hasHydrated]);

  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      address: user?.address?.street || '',
      city: user?.address?.city || '',
      zipCode: user?.address?.postCode || '',
      country: user?.address?.country || '',
    }
  });

  // Update form when user data becomes available
  useEffect(() => {
    if (user?.address) {
      shippingForm.reset({
        address: user.address.street || '',
        city: user.address.city || '',
        zipCode: user.address.postCode || '',
        country: user.address.country || '',
      });
    }
  }, [user, shippingForm]);

  const onShippingSubmit = async (data: ShippingFormData) => {
    try {
      // Prepare cart items for backend
      const cartItems = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        quantity: item.quantity,
        images: item.product.images
      }));

      // Calculate total
      const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      // Call checkout service
      const result = await checkoutService.createCheckoutSession({
        cartItems,
        customerEmail: user?.email || '',
        address: {
          street: data.address,
          city: data.city,
          postCode: data.zipCode,
          country: data.country
        },
        total
      });
      
      if (result && result.url) {
        // Redirect to Stripe checkout URL (don't clear cart yet)
        window.location.href = result.url;
      } else {
        toast.error('Failed to start checkout.');
      }
    } catch {
      toast.error('Failed to start checkout.');
    }
  };

  if (!hasHydrated) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-lg">Loading...</div>;
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some items to your cart to checkout</p>
            <Link href="/">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/cart" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
            <div className="text-sm font-medium text-black">
              Checkout
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter your shipping details</CardDescription>
            </CardHeader>
            <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input {...shippingForm.register('address')} />
                  {shippingForm.formState.errors.address && (
                    <p className="text-sm text-red-500">{shippingForm.formState.errors.address.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Input {...shippingForm.register('city')} />
                    {shippingForm.formState.errors.city && (
                      <p className="text-sm text-red-500">{shippingForm.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Postal Code</label>
                    <Input {...shippingForm.register('zipCode')} />
                    {shippingForm.formState.errors.zipCode && (
                      <p className="text-sm text-red-500">{shippingForm.formState.errors.zipCode.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Country</label>
                    <Input {...shippingForm.register('country')} />
                    {shippingForm.formState.errors.country && (
                      <p className="text-sm text-red-500">{shippingForm.formState.errors.country.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  All fields are required
                </div>
                <Button type="submit">
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
} 