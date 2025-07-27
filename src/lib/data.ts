import {  Address } from '@/types';

// Mock products data
export const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 50,
    published: true,
    featured: true,
    createdAt: new Date('2025-06-06'),
    updatedAt: new Date('2025-06-06'),
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 25,
    published: true,
    featured: true,
    createdAt: new Date('2025-06-02'),
    updatedAt: new Date('2025-06-02'),
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly cotton t-shirt available in multiple colors.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'Clothing',
    stock: 100,
    published: true,
    featured: false,
    createdAt: new Date('2025-06-03'),
    updatedAt: new Date('2025-06-03'),
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    description: 'Keep your drinks cold for 24 hours with this premium insulated water bottle.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    category: 'Home & Garden',
    stock: 75,
    published: true,
    featured: false,
    createdAt: new Date('2025-06-04'),
    updatedAt: new Date('2025-06-04'),
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop',
    category: 'Electronics',
    stock: 40,
    published: true,
    featured: false,
    createdAt: new Date('2025-06-05'),
    updatedAt: new Date('2025-06-05'),
  },
  {
    id: '6',
    name: 'Leather Wallet',
    description: 'Handcrafted genuine leather wallet with multiple card slots and RFID protection.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
    category: 'Accessories',
    stock: 60,
    published: true,
    featured: false,
    createdAt: new Date('2025-06-06'),
    updatedAt: new Date('2025-06-06'),
  },
];

// Mock user data
export const mockUser = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  addresses: [
    {
      id: '1',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      isDefault: true,
    },
  ],
  createdAt: new Date('2025-06-25'),
};

// Mock orders data
const mockAddresses: Address[] = [
  {
    id: '1',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    isDefault: true,
  },
  {
    id: '2',
    street: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'USA',
    isDefault: false,
  },
];

export const mockOrders = [
  {
    id: '1001',
    userId: '1',
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    items: [
      { id: '1', product: mockProducts[0], quantity: 1 },
      { id: '2', product: mockProducts[2], quantity: 2 },
    ],
    total: 159.97,
    status: 'completed',
    paymentStatus: 'paid',
    shippingAddress: mockAddresses[0],
    createdAt: new Date('2025-05-06'),
    updatedAt: new Date('2025-06-06'),
  },
  {
    id: '1002',
    userId: '2',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    items: [
      { id: '3', product: mockProducts[1], quantity: 1 },
    ],
    total: 199.99,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: mockAddresses[1],
    createdAt: new Date('2025-04-02'),
    updatedAt: new Date('2025-04-02'),
  },
  {
    id: '1003',
    userId: '3',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    items: [
      { id: '4', product: mockProducts[3], quantity: 3 },
    ],
    total: 74.97,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: mockAddresses[0],
    createdAt: new Date('2025-04-03'),
    updatedAt: new Date('2025-04-03'),
  },
  {
    id: '1004',
    userId: '4',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com'
    },
    items: [
      { id: '5', product: mockProducts[4], quantity: 2 },
    ],
    total: 79.98,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: mockAddresses[1],
    createdAt: new Date('2025-04-04'),
    updatedAt: new Date('2025-04-04'),
  },
  {
    id: '1005',
    userId: '5',
    customer: {
      name: 'David Brown',
      email: 'david@example.com'
    },
    items: [
      { id: '6', product: mockProducts[5], quantity: 1 },
    ],
    total: 49.99,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: mockAddresses[0],
    createdAt: new Date('2025-04-05'),
    updatedAt: new Date('2025-04-05'),
  },
];
