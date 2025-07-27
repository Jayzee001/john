import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CheckoutFailed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Payment Failed</h1>
        <p className="text-gray-700 mb-6">Unfortunately, your payment could not be processed. Please try again or use a different payment method.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/checkout">
            <Button>Try Again</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 