import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['CUSTOMER', 'MERCHANT', 'ADMIN']).default('CUSTOMER'),
  phone: z.string().optional(),
  // For merchant registration:
  storeName: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(5, 'Product description is required'),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  categoryId: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true)
});

export const updateProductSchema = createProductSchema.partial();

export const updateMerchantProfileSchema = z.object({
  storeName: z.string().min(2, 'Store name is required'),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional()
});

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1')
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Recipient name is required'),
  customerPhone: z.string().min(5, 'Contact phone is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(['COD']).default('COD')
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'])
});
