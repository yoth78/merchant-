import { db } from '../database/db.js';
import { OrderStatus } from '../types/index.js';

export class OrderService {
  /**
   * Customer Orders List: Groups orders by checkout session
   */
  static getCustomerOrders(customerId: string) {
    const store = db.get();
    const customerOrders = store.orders.filter(o => o.customerId === customerId);

    // Group customer orders by checkoutId
    const checkoutsMap = new Map<string, { checkout: any; orders: any[] }>();

    for (const order of customerOrders) {
      const checkout = store.checkouts.find(c => c.id === order.checkoutId);
      const merchant = store.merchants.find(m => m.id === order.merchantId);
      const items = store.orderItems.filter(it => it.orderId === order.id);

      const enrichedOrder = {
        ...order,
        merchantName: merchant ? merchant.storeName : 'Merchant',
        merchantLogo: merchant ? merchant.logoUrl : null,
        items
      };

      if (!checkoutsMap.has(order.checkoutId)) {
        checkoutsMap.set(order.checkoutId, {
          checkout: checkout || {
            id: order.checkoutId,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt
          },
          orders: []
        });
      }

      checkoutsMap.get(order.checkoutId)!.orders.push(enrichedOrder);
    }

    return Array.from(checkoutsMap.values()).sort(
      (a, b) => new Date(b.checkout.createdAt).getTime() - new Date(a.checkout.createdAt).getTime()
    );
  }

  static getCustomerOrderById(orderId: string, customerId: string) {
    const store = db.get();
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return null;

    if (order.customerId !== customerId) {
      throw new Error('Unauthorized: You can only view your own orders.');
    }

    const merchant = store.merchants.find(m => m.id === order.merchantId);
    const checkout = store.checkouts.find(c => c.id === order.checkoutId);
    const items = store.orderItems.filter(it => it.orderId === order.id);

    return {
      ...order,
      merchant,
      checkout,
      items
    };
  }

  /**
   * Merchant Orders: Strictly isolated to own merchantId
   */
  static getMerchantOrders(merchantId: string, status?: string) {
    const store = db.get();
    let orders = store.orders.filter(o => o.merchantId === merchantId);

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(o => {
        const items = store.orderItems.filter(it => it.orderId === o.id);
        return {
          ...o,
          items
        };
      });
  }

  static getMerchantOrderById(orderId: string, merchantId: string) {
    const store = db.get();
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return null;

    if (order.merchantId !== merchantId) {
      throw new Error('Unauthorized: You cannot access orders belonging to another merchant.');
    }

    const items = store.orderItems.filter(it => it.orderId === order.id);
    const checkout = store.checkouts.find(c => c.id === order.checkoutId);

    return {
      ...order,
      items,
      checkout
    };
  }

  static updateOrderStatus(orderId: string, merchantId: string, newStatus: OrderStatus) {
    const store = db.get();
    const orderIndex = store.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const order = store.orders[orderIndex];
    if (order.merchantId !== merchantId) {
      throw new Error('Unauthorized: You cannot update status of orders belonging to another merchant.');
    }

    // Status transition validation
    order.status = newStatus;
    if (newStatus === 'DELIVERED') {
      order.paymentStatus = 'PAID'; // Paid upon Cash on Delivery
    }
    order.updatedAt = new Date();

    store.orders[orderIndex] = order;

    // Send customer notification
    const merchant = store.merchants.find(m => m.id === merchantId);
    store.notifications.push({
      id: `notif-${Date.now()}-status`,
      userId: order.customerId,
      title: `Order #${order.orderNumber} ${newStatus}`,
      message: `Your order from ${merchant?.storeName || 'Merchant'} status is now: ${newStatus}`,
      isRead: false,
      linkUrl: `/orders/${order.id}`,
      createdAt: new Date()
    });

    db.save(store);
    return order;
  }
}
