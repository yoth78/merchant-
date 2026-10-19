import { Response } from 'express';
import { CartService } from '../services/cart.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { addToCartSchema, updateCartItemSchema } from '../validators/index.js';

export class CartController {
  static getCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = CartService.getCart(req.user!.userId);
      res.json({ cart });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static addItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { productId, quantity } = addToCartSchema.parse(req.body);
      const cart = CartService.addItem(req.user!.userId, productId, quantity);
      res.json({ cart });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static updateItem(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const { quantity } = updateCartItemSchema.parse(req.body);
      const cart = CartService.updateQuantity(req.user!.userId, id, quantity);
      res.json({ cart });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const cart = CartService.removeItem(req.user!.userId, id);
      res.json({ cart });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static clearCart(req: AuthenticatedRequest, res: Response) {
    try {
      CartService.clearCart(req.user!.userId);
      res.json({ message: 'Cart cleared' });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
