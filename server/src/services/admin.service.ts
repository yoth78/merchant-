import { db } from '../database/db.js';
import { MerchantStatus } from '../types/index.js';

export class AdminService {
  static getStats() {
    const store = db.get();
    const totalCustomers = store.users.filter(u => u.role === 'CUSTOMER').length;
    const totalMerchants = store.merchants.length;
    const totalProducts = store.products.length;
    const totalOrders = store.orders.length;
    const totalCheckouts = store.checkouts.length;
    const totalSales = store.orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    return {
      totalCustomers,
      totalMerchants,
      totalProducts,
      totalOrders,
      totalCheckouts,
      totalSales: Number(totalSales.toFixed(2))
    };
  }

  static getMerchants() {
    const store = db.get();
    return store.merchants.map(m => {
      const user = store.users.find(u => u.id === m.userId);
      const productCount = store.products.filter(p => p.merchantId === m.id).length;
      const orderCount = store.orders.filter(o => o.merchantId === m.id).length;
      return {
        ...m,
        userEmail: user?.email,
        userName: user?.name,
        productCount,
        orderCount
      };
    });
  }

  static updateMerchantStatus(merchantId: string, status: MerchantStatus) {
    const store = db.get();
    const index = store.merchants.findIndex(m => m.id === merchantId);
    if (index === -1) {
      throw new Error('Merchant not found');
    }

    store.merchants[index].status = status;
    store.merchants[index].updatedAt = new Date();

    // Notify merchant
    store.notifications.push({
      id: `notif-${Date.now()}-adm`,
      userId: store.merchants[index].userId,
      title: 'Store Status Updated',
      message: `Your merchant account status has been updated to: ${status}`,
      isRead: false,
      linkUrl: '/merchant',
      createdAt: new Date()
    });

    db.save(store);
    return store.merchants[index];
  }

  static getCustomers() {
    const store = db.get();
    return store.users
      .filter(u => u.role === 'CUSTOMER')
      .map(u => {
        const orderCount = store.orders.filter(o => o.customerId === u.id).length;
        const totalSpent = store.orders
          .filter(o => o.customerId === u.id && o.status !== 'CANCELLED')
          .reduce((sum, o) => sum + Number(o.totalAmount), 0);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          createdAt: u.createdAt,
          orderCount,
          totalSpent: Number(totalSpent.toFixed(2))
        };
      });
  }

  static getAllOrders() {
    const store = db.get();
    return store.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(o => {
        const merchant = store.merchants.find(m => m.id === o.merchantId);
        const items = store.orderItems.filter(i => i.orderId === o.id);
        return {
          ...o,
          merchantName: merchant ? merchant.storeName : 'Merchant',
          items
        };
      });
  }

  static getAllCheckouts() {
    const store = db.get();
    return store.checkouts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(c => {
        const orders = store.orders.filter(o => o.checkoutId === c.id);
        return {
          ...c,
          merchantCount: orders.length,
          orders
        };
      });
  }
}
