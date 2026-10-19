import { db } from '../database/db.js';
import { CartService } from './cart.service.js';
import { Checkout, Order, OrderItem } from '../types/index.js';

export interface CheckoutInput {
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  paymentMethod?: 'COD';
}

export class CheckoutService {
  /**
   * Core multi-merchant checkout transaction:
   * 1. Validates all cart items and verifies current stock.
   * 2. Groups cart items by merchant.
   * 3. Calculates merchant subtotals and overall total.
   * 4. Creates 1 Checkout / OrderGroup record.
   * 5. Creates 1 separate Order for EACH merchant.
   * 6. Creates corresponding OrderItem records snapshotting purchased unitPrice.
   * 7. Reduces inventory for each product.
   * 8. Clears customer cart.
   * 9. Generates in-app notifications for merchants.
   */
  static processCheckout(input: CheckoutInput) {
    return db.transaction((store) => {
      const cart = CartService.getCart(input.customerId);
      if (cart.items.length === 0) {
        throw new Error('Your cart is empty. Please add items before checking out.');
      }

      // Step 1: Validate stock for all items
      for (const item of cart.items) {
        if (!item.product) continue;
        const currentProd = store.products.find(p => p.id === item.productId);
        if (!currentProd || !currentProd.isActive) {
          throw new Error(`Product "${item.product.name}" is no longer available.`);
        }
        if (currentProd.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for "${currentProd.name}". Requested: ${item.quantity}, Available: ${currentProd.stock}`
          );
        }
      }

      // Step 2 & 3: Group by merchant and prepare orders
      const checkoutTimestamp = new Date();
      const checkoutSeq = Math.floor(1000 + Math.random() * 9000);
      const checkoutId = `chk-${Date.now()}`;
      const checkoutOrderNumber = `CHK-${checkoutSeq}`;

      const createdOrders: Order[] = [];
      const createdOrderItems: OrderItem[] = [];

      let orderSeqCounter = Math.floor(2000 + Math.random() * 7000);

      // Loop through each merchant group
      for (const group of cart.groups) {
        const orderId = `ord-${Date.now()}-${group.merchantId}`;
        const orderNumber = `ORD-${orderSeqCounter++}`;

        const merchantOrder: Order = {
          id: orderId,
          orderNumber,
          checkoutId,
          customerId: input.customerId,
          merchantId: group.merchantId,
          subtotal: group.subtotal,
          deliveryFee: 0,
          totalAmount: group.subtotal,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          deliveryAddress: input.deliveryAddress,
          deliveryNotes: input.deliveryNotes || null,
          createdAt: checkoutTimestamp,
          updatedAt: checkoutTimestamp
        };

        createdOrders.push(merchantOrder);

        // Process items for this merchant
        for (const item of group.items) {
          if (!item.product) continue;

          // Snapshot unitPrice at purchase time
          const orderItem: OrderItem = {
            id: `item-${Date.now()}-${item.productId}`,
            orderId,
            productId: item.productId,
            productName: item.product.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
            totalPrice: Number((item.product.price * item.quantity).toFixed(2)),
            createdAt: checkoutTimestamp
          };

          createdOrderItems.push(orderItem);

          // Step 7: Decrease inventory
          const prodIndex = store.products.findIndex(p => p.id === item.productId);
          if (prodIndex >= 0) {
            store.products[prodIndex].stock -= item.quantity;
            store.products[prodIndex].updatedAt = checkoutTimestamp;
          }
        }

        // Step 9: In-app notification for the merchant
        const merchantObj = store.merchants.find(m => m.id === group.merchantId);
        if (merchantObj) {
          store.notifications.push({
            id: `notif-${Date.now()}-${group.merchantId}`,
            userId: merchantObj.userId,
            title: 'New Order Received',
            message: `You have received Order #${orderNumber} (${group.items.length} items, $${group.subtotal.toFixed(2)})`,
            isRead: false,
            linkUrl: `/merchant/orders/${orderId}`,
            createdAt: checkoutTimestamp
          });
        }
      }

      // Step 4: Create Checkout / OrderGroup
      const checkoutRecord: Checkout = {
        id: checkoutId,
        orderNumber: checkoutOrderNumber,
        customerId: input.customerId,
        totalAmount: cart.totalAmount,
        paymentMethod: input.paymentMethod || 'COD',
        paymentStatus: 'PENDING',
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        deliveryAddress: input.deliveryAddress,
        deliveryNotes: input.deliveryNotes || null,
        createdAt: checkoutTimestamp,
        updatedAt: checkoutTimestamp
      };

      // Commit to DB
      store.checkouts.push(checkoutRecord);
      store.orders.push(...createdOrders);
      store.orderItems.push(...createdOrderItems);

      // Step 8: Clear customer cart
      const cartId = `cart-${input.customerId}`;
      store.cartItems = store.cartItems.filter(i => i.cartId !== cartId);

      // Step 9b: Customer confirmation notification
      store.notifications.push({
        id: `notif-${Date.now()}-cust`,
        userId: input.customerId,
        title: 'Checkout Confirmation',
        message: `Your checkout #${checkoutOrderNumber} was placed successfully with ${createdOrders.length} merchant order(s).`,
        isRead: false,
        linkUrl: `/checkout/${checkoutId}`,
        createdAt: checkoutTimestamp
      });

      return {
        checkout: checkoutRecord,
        orders: createdOrders.map(o => {
          const merchant = store.merchants.find(m => m.id === o.merchantId);
          const items = createdOrderItems.filter(it => it.orderId === o.id);
          return {
            ...o,
            merchantName: merchant ? merchant.storeName : 'Merchant',
            items
          };
        }),
        summary: {
          totalMerchants: createdOrders.length,
          totalItems: cart.totalItems,
          totalAmount: cart.totalAmount
        }
      };
    });
  }

  static getCheckoutById(checkoutId: string, customerId?: string) {
    const store = db.get();
    const checkout = store.checkouts.find(c => c.id === checkoutId);
    if (!checkout) return null;

    if (customerId && checkout.customerId !== customerId) {
      throw new Error('Unauthorized access to this checkout.');
    }

    const orders = store.orders
      .filter(o => o.checkoutId === checkoutId)
      .map(o => {
        const merchant = store.merchants.find(m => m.id === o.merchantId);
        const items = store.orderItems.filter(it => it.orderId === o.id);
        return {
          ...o,
          merchant: merchant ? { id: merchant.id, storeName: merchant.storeName, logoUrl: merchant.logoUrl, phone: merchant.phone } : null,
          items
        };
      });

    return {
      checkout,
      orders
    };
  }
}
