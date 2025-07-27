/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  isActive: boolean;
  published: boolean;
  featured: boolean;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    productsPerPage: number;
  };
  filters: {
    search: string | null;
    category: string | null;
    status: string;
    stock: string;
  };
}

export interface ProductDetailResponse {
  product: Product;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  role: "customer" | "admin";
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string; // API returns ISO string
  // Legacy support for existing code
  name?: string;
  image?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Customer {
  name: string;
  email: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
  status: OrderStatus;
  total: number;
  stripeSessionId?: string;
  customerEmail: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface StripeCheckoutSession {
  id: string;
  url: string;
}
