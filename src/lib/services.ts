/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./api";
import type { Product, User, Order } from "@/types";

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: {
        user: User;
        token: string;
      };
    }>("/auth/login", {
      email,
      password,
    });
  },

  signup: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: {
        user: User;
        token: string;
      };
    }>("/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
  },

  logout: async () => {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: {
        message: string;
      };
    }>("/auth/logout");
  },

  getProfile: async () => {
    return apiClient.get<{
      success: boolean;
      data: {
        user: User;
      };
    }>("/auth/profile");
  },
};

// Product Service
export const productService = {
  getAll: async () => {
    return apiClient.get<Product[]>("/products");
  },

  getById: async (id: string) => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  create: async (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    return apiClient.post<Product>("/products", product);
  },

  update: async (id: string, updates: Partial<Product>) => {
    return apiClient.put<Product>(`/products/${id}`, updates);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/products/${id}`);
  },

  getByCategory: async (category: string) => {
    return apiClient.get<Product[]>(`/products?category=${category}`);
  },

  search: async (query: string) => {
    return apiClient.get<Product[]>(
      `/products/search?q=${encodeURIComponent(query)}`
    );
  },
};

// Order Service
export const orderService = {
  getUserOrders: async (params: { page?: number; limit?: number } = {}) => {
    const response = await apiClient.get<{
      success: boolean;
      orders: Order[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>("/users/orders", { params });
    return response;
  },

  getUserOrder: async (id: string) => {
    const response = await apiClient.get<{
      success: boolean;
      order: Order;
    }>(`/users/orders/${id}`);
    return response;
  },
};

// Cart Service
export const cartService = {
  getCart: async () => {
    return apiClient.get("/cart");
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    return apiClient.post("/cart/add", { productId, quantity });
  },

  updateCartItem: async (productId: string, quantity: number) => {
    return apiClient.put(`/cart/${productId}`, { quantity });
  },

  removeFromCart: async (productId: string) => {
    return apiClient.delete(`/cart/${productId}`);
  },

  clearCart: async () => {
    return apiClient.delete("/cart");
  },
};

// User Service
export const userService = {
  getAll: async () => {
    return apiClient.get<User[]>("/users");
  },

  getById: async (id: string) => {
    return apiClient.get<User>(`/users/${id}`);
  },

  update: async (id: string, updates: Partial<User>) => {
    return apiClient.put<User>(`/users/${id}`, updates);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/users/${id}`);
  },
};

// Address service
export const addressService = {
  getUserAddress: async () => {
    const response = await apiClient.get<{
      success: boolean;
      data: { address: any };
    }>("/users/address");
    return response.data;
  },

  addAddress: async (addressData: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  }) => {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: any;
    }>("/users/address", addressData);
    return response.data;
  },

  updateAddress: async (addressData: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  }) => {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: any;
    }>("/users/address", addressData);
    return response.data;
  },
};

// Checkout service
export const checkoutService = {
  createCheckoutSession: async (checkoutData: {
    cartItems: Array<{
      productId: string;
      name: string;
      description: string;
      price: number;
      quantity: number;
      images: string[];
    }>;
    customerEmail: string;
    address: {
      street: string;
      city: string;
      postCode: string;
      country: string;
    };
    total: number;
  }) => {
    const response = await apiClient.post<{ success: boolean; url: string }>(
      "/users/checkout",
      checkoutData
    );
    return response;
  },
};
