import { db } from '../database/db.js';

export class CartService {
  static getCart(userId: string) {
    const store = db.get();
    const cartId = `cart-${userId}`;
    const items = store.cartItems.filter(i => i.cartId === cartId);

    // Populate product details & group by merchant
    const populatedItems = items.map(item => {
      const product = store.products.find(p => p.id === item.productId);
      const merchant = product ? store.merchants.find(m => m.id === product.merchantId) : null;

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: product
          ? {
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              imageUrl: product.imageUrl,
              merchantId: product.merchantId,
              merchantName: merchant ? merchant.storeName : 'Unknown Merchant',
              merchantLogo: merchant ? merchant.logoUrl : null,
              isActive: product.isActive
            }
          : null
      };
    }).filter(i => i.product !== null); // Filter deleted products

    // Group items by merchant
    const merchantGroups: {
      [merchantId: string]: {
        merchantId: string;
        merchantName: string;
        merchantLogo?: string | null;
        items: typeof populatedItems;
        subtotal: number;
      };
    } = {};

    let totalAmount = 0;
    let totalItems = 0;

    for (const item of populatedItems) {
      if (!item.product) continue;
      const mId = item.product.merchantId;
      if (!merchantGroups[mId]) {
        merchantGroups[mId] = {
          merchantId: mId,
          merchantName: item.product.merchantName,
          merchantLogo: item.product.merchantLogo,
          items: [],
          subtotal: 0
        };
      }

      merchantGroups[mId].items.push(item);
      const itemSubtotal = item.product.price * item.quantity;
      merchantGroups[mId].subtotal += itemSubtotal;
      totalAmount += itemSubtotal;
      totalItems += item.quantity;
    }

    return {
      items: populatedItems,
      groups: Object.values(merchantGroups).map(g => ({
        ...g,
        subtotal: Number(g.subtotal.toFixed(2))
      })),
      totalAmount: Number(totalAmount.toFixed(2)),
      totalItems
    };
  }

  static addItem(userId: string, productId: string, quantity: number) {
    const store = db.get();
    const product = store.products.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.isActive) {
      throw new Error('This product is currently inactive');
    }

    const cartId = `cart-${userId}`;
    const existingIndex = store.cartItems.findIndex(i => i.cartId === cartId && i.productId === productId);

    const currentQty = existingIndex >= 0 ? store.cartItems[existingIndex].quantity : 0;
    const targetQty = currentQty + quantity;

    if (targetQty > product.stock) {
      throw new Error(`Only ${product.stock} items available in stock.`);
    }

    if (existingIndex >= 0) {
      store.cartItems[existingIndex].quantity = targetQty;
      store.cartItems[existingIndex].updatedAt = new Date();
    } else {
      store.cartItems.push({
        id: `cart-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        cartId,
        productId,
        quantity: targetQty,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    db.save(store);
    return this.getCart(userId);
  }

  static updateQuantity(userId: string, itemId: string, quantity: number) {
    const store = db.get();
    const cartId = `cart-${userId}`;
    const itemIndex = store.cartItems.findIndex(i => i.id === itemId && i.cartId === cartId);

    if (itemIndex === -1) {
      throw new Error('Cart item not found');
    }

    const item = store.cartItems[itemIndex];
    const product = store.products.find(p => p.id === item.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} items available in stock.`);
    }

    if (quantity <= 0) {
      store.cartItems.splice(itemIndex, 1);
    } else {
      store.cartItems[itemIndex].quantity = quantity;
      store.cartItems[itemIndex].updatedAt = new Date();
    }

    db.save(store);
    return this.getCart(userId);
  }

  static removeItem(userId: string, itemId: string) {
    const store = db.get();
    const cartId = `cart-${userId}`;
    store.cartItems = store.cartItems.filter(i => !(i.id === itemId && i.cartId === cartId));
    db.save(store);
    return this.getCart(userId);
  }

  static clearCart(userId: string) {
    const store = db.get();
    const cartId = `cart-${userId}`;
    store.cartItems = store.cartItems.filter(i => i.cartId !== cartId);
    db.save(store);
  }
}
