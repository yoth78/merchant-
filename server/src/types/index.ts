export type Role = 'CUSTOMER' | 'MERCHANT' | 'ADMIN';
export type MerchantStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'COD';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Merchant {
  id: string;
  userId: string;
  storeName: string;
  description?: string | null;
  phone?: string | null;
  address?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  status: MerchantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  merchantId: string;
  categoryId?: string | null;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Checkout {
  id: string;
  orderNumber: string;
  customerId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  checkoutId: string;
  customerId: string;
  merchantId: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string | null;
  createdAt: Date;
}

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: Role;
  merchantId?: string;
}
