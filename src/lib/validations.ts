import { z } from 'zod';

export const shippingSchema = z.object({
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  state: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
});

export const paymentSchema = z.object({
  cardNumber: z.string().min(13, 'Please enter a valid card number'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Please enter expiry date in MM/YY format'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits').max(4, 'CVV must be at most 4 digits'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
});

export const checkoutSchema = z.object({
  shipping: shippingSchema,
  payment: paymentSchema,
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>; 