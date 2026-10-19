import bcrypt from 'bcryptjs';
import { db } from '../database/db.js';
import { signToken } from '../utils/jwt.js';
import { Role } from '../types/index.js';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    storeName?: string;
    description?: string;
    address?: string;
  }) {
    const store = db.get();
    const existing = store.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);
    const userId = `user-${Date.now()}`;

    const newUser = {
      id: userId,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role,
      phone: data.phone || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let merchantId: string | undefined;

    // If registering as a MERCHANT, automatically initialize merchant store
    if (data.role === 'MERCHANT') {
      merchantId = `merchant-${Date.now()}`;
      const newMerchant = {
        id: merchantId,
        userId: userId,
        storeName: data.storeName || `${data.name}'s Store`,
        description: data.description || 'Welcome to our shop on the marketplace.',
        phone: data.phone || null,
        address: data.address || null,
        logoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        status: 'APPROVED' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      store.merchants.push(newMerchant);
    }

    store.users.push(newUser);
    db.save(store);

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      merchantId
    });

    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        merchantId
      }
    };
  }

  static async login(email: string, pass: string) {
    const store = db.get();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    let merchantId: string | undefined;
    if (user.role === 'MERCHANT') {
      const merchant = store.merchants.find(m => m.userId === user.id);
      if (merchant) {
        merchantId = merchant.id;
      }
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      merchantId
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        merchantId
      }
    };
  }

  static async getMe(userId: string) {
    const store = db.get();
    const user = store.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    let merchant = null;
    if (user.role === 'MERCHANT') {
      merchant = store.merchants.find(m => m.userId === user.id) || null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      merchant
    };
  }
}
