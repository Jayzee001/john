import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      total: 0,

      addItem: (product: Product, quantity: number) => {
        const items = get().items;
        const existingItem = items.find(item => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = Math.min(existingItem.quantity + quantity, product.quantity);
          get().updateQuantity(existingItem.id, newQuantity);
          toast.success(`Updated ${product.name} quantity in cart`);
          return;
        }

        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity: Math.min(quantity, product.quantity)
        };

        set(state => {
          const newItems = [...state.items, newItem];
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
          };
        });
        
        toast.success(`Added ${product.name} to cart`);
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set(state => {
          const newItems = state.items.map(item => {
            if (item.id === itemId) {
              const newQuantity = Math.min(quantity, item.product.quantity);
              if (newQuantity !== item.quantity) {
                toast.info(`Updated ${item.product.name} quantity to ${newQuantity}`);
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          });

          return {
            items: newItems,
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
          };
        });
      },

      removeItem: (itemId: string) => {
        const item = get().items.find(item => item.id === itemId);
        set(state => {
          const newItems = state.items.filter(item => item.id !== itemId);
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
          };
        });
        if (item) {
          toast.error(`Removed ${item.product.name} from cart`);
        }
      },

      clearCart: () => {
        set({ items: [], itemCount: 0, total: 0 });
        toast.info('Cart cleared');
      }
    }),
    {
      name: 'cart-storage',
    }
  )
); 