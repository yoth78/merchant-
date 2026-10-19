export type Role = 'CUSTOMER' | 'MERCHANT' | 'ADMIN';
export type MerchantStatus = 'PENDING' | 'APPROVED' | 'SUSPENDED';
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  merchantId?: string;
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
  productCount?: number;
  products?: Product[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
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
  merchant?: {
    id: string;
    storeName: string;
    logoUrl?: string | null;
    address?: string | null;
  } | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  merchantId: string;
  merchantName: string;
  merchantLogo?: string | null;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct | null;
}

export interface MerchantCartGroup {
  merchantId: string;
  merchantName: string;
  merchantLogo?: string | null;
  items: CartItem[];
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  groups: MerchantCartGroup[];
  totalAmount: number;
  totalItems: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  checkoutId: string;
  customerId: string;
  merchantId: string;
  merchantName?: string;
  merchantLogo?: string | null;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  merchant?: Merchant;
}

export interface Checkout {
  id: string;
  orderNumber: string;
  customerId: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string | null;
  createdAt: string;
}
