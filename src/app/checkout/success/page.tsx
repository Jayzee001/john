'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useEffect } from 'react';

export default function CheckoutSuccess() {
  const { clearCart } = useCartStore();

  // Clear cart on success page load
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Thank you for your order!</h1>
        <p className="text-gray-700 mb-6">Your payment was successful and your order is being processed.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
} 