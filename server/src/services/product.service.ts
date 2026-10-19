import { db } from '../database/db.js';
import { Product } from '../types/index.js';

export class ProductService {
  static getAll(filters?: {
    search?: string;
    categoryId?: string;
    merchantId?: string;
    isActive?: boolean;
    sort?: 'price_asc' | 'price_desc' | 'newest';
  }) {
    const store = db.get();
    let items = [...store.products];

    if (filters?.isActive !== undefined) {
      items = items.filter(p => p.isActive === filters.isActive);
    } else {
      // By default for customer view, return only active products
      items = items.filter(p => p.isActive);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (filters?.categoryId) {
      items = items.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.merchantId) {
      items = items.filter(p => p.merchantId === filters.merchantId);
    }

    if (filters?.sort === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (filters?.sort === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items.map(p => {
      const merchant = store.merchants.find(m => m.id === p.merchantId);
      const category = store.categories.find(c => c.id === p.categoryId);
      return {
        ...p,
        merchant: merchant ? { id: merchant.id, storeName: merchant.storeName, logoUrl: merchant.logoUrl } : null,
        category: category ? { id: category.id, name: category.name } : null
      };
    });
  }

  static getById(id: string) {
    const store = db.get();
    const product = store.products.find(p => p.id === id);
    if (!product) return null;

    const merchant = store.merchants.find(m => m.id === product.merchantId);
    const category = store.categories.find(c => c.id === product.categoryId);

    return {
      ...product,
      merchant: merchant ? { id: merchant.id, storeName: merchant.storeName, logoUrl: merchant.logoUrl, address: merchant.address } : null,
      category: category ? { id: category.id, name: category.name } : null
    };
  }

  static create(merchantId: string, data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId?: string;
    imageUrl?: string;
    isActive?: boolean;
  }) {
    const store = db.get();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      merchantId,
      categoryId: data.categoryId || null,
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      isActive: data.isActive !== undefined ? data.isActive : true,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    store.products.unshift(newProduct);
    db.save(store);
    return newProduct;
  }

  static update(productId: string, merchantId: string, data: Partial<Product>) {
    const store = db.get();
    const index = store.products.findIndex(p => p.id === productId);
    if (index === -1) {
      throw new Error('Product not found');
    }

    const current = store.products[index];
    if (current.merchantId !== merchantId) {
      throw new Error('Unauthorized: You can only edit your own products.');
    }

    const updated = {
      ...current,
      ...data,
      updatedAt: new Date()
    };

    store.products[index] = updated;
    db.save(store);
    return updated;
  }

  static delete(productId: string, merchantId: string) {
    const store = db.get();
    const product = store.products.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.merchantId !== merchantId) {
      throw new Error('Unauthorized: You can only delete your own products.');
    }

    store.products = store.products.filter(p => p.id !== productId);
    db.save(store);
    return { success: true };
  }
}
