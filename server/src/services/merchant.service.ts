import { db } from '../database/db.js';
import { Merchant } from '../types/index.js';

export class MerchantService {
  static getAll(status?: string) {
    const store = db.get();
    let merchants = [...store.merchants];
    if (status) {
      merchants = merchants.filter(m => m.status === status);
    }
    return merchants.map(m => {
      const productCount = store.products.filter(p => p.merchantId === m.id && p.isActive).length;
      return {
        ...m,
        productCount
      };
    });
  }

  static getById(id: string) {
    const store = db.get();
    const merchant = store.merchants.find(m => m.id === id);
    if (!merchant) return null;

    const products = store.products
      .filter(p => p.merchantId === id && p.isActive)
      .map(p => {
        const cat = store.categories.find(c => c.id === p.categoryId);
        return {
          ...p,
          category: cat ? { id: cat.id, name: cat.name } : null
        };
      });

    return {
      ...merchant,
      products
    };
  }

  static updateProfile(merchantId: string, data: Partial<Merchant>) {
    const store = db.get();
    const index = store.merchants.findIndex(m => m.id === merchantId);
    if (index === -1) {
      throw new Error('Merchant store not found');
    }

    const updated = {
      ...store.merchants[index],
      ...data,
      updatedAt: new Date()
    };

    store.merchants[index] = updated;
    db.save(store);
    return updated;
  }

  static getDashboardStats(merchantId: string) {
    const store = db.get();
    const orders = store.orders.filter(o => o.merchantId === merchantId);
    const products = store.products.filter(p => p.merchantId === merchantId);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const completedOrders = orders.filter(o => o.status === 'DELIVERED').length;
    const totalSales = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const lowStockProducts = products.filter(p => p.stock < 10);
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(o => {
        const items = store.orderItems.filter(item => item.orderId === o.id);
        return {
          ...o,
          items
        };
      });

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales: Number(totalSales.toFixed(2)),
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders
    };
  }
}
