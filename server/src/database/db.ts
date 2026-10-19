import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Merchant,
  Category,
  Product,
  CartItem,
  Checkout,
  Order,
  OrderItem,
  Notification
} from '../types/index.js';

const DB_FILE = path.join(process.cwd(), 'local-storage.json');

export interface MarketplaceStorage {
  users: User[];
  merchants: Merchant[];
  categories: Category[];
  products: Product[];
  cartItems: CartItem[];
  checkouts: Checkout[];
  orders: Order[];
  orderItems: OrderItem[];
  notifications: Notification[];
}

const defaultData: MarketplaceStorage = {
  users: [],
  merchants: [],
  categories: [],
  products: [],
  cartItems: [],
  checkouts: [],
  orders: [],
  orderItems: [],
  notifications: []
};

function readDb(): MarketplaceStorage {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(defaultData);
      return defaultData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading local db file, falling back to default:', err);
    return defaultData;
  }
}

function writeDb(data: MarketplaceStorage): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local db file:', err);
  }
}

export const db = {
  get: readDb,
  save: writeDb,

  // Helper transaction simulator
  transaction: <T>(callback: (current: MarketplaceStorage) => T): T => {
    const current = readDb();
    const result = callback(current);
    writeDb(current);
    return result;
  }
};
