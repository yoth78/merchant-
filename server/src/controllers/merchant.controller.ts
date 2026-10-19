import { Request, Response } from 'express';
import { MerchantService } from '../services/merchant.service.js';
import { OrderService } from '../services/order.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { updateMerchantProfileSchema, updateOrderStatusSchema } from '../validators/index.js';

export class MerchantController {
  static getAll(req: Request, res: Response) {
    try {
      const merchants = MerchantService.getAll('APPROVED');
      res.json({ merchants });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const merchant = MerchantService.getById(id);
      if (!merchant) {
        return res.status(404).json({ message: 'Merchant not found' });
      }
      res.json({ merchant });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const data = updateMerchantProfileSchema.parse(req.body);
      const merchant = MerchantService.updateProfile(req.user.merchantId, data);
      res.json({ merchant });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static getDashboard(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const stats = MerchantService.getDashboardStats(req.user.merchantId);
      res.json({ stats });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getOrders(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const status = req.query.status as string;
      const orders = OrderService.getMerchantOrders(req.user.merchantId, status);
      res.json({ orders });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const id = String(req.params.id);
      const order = OrderService.getMerchantOrderById(id, req.user.merchantId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json({ order });
    } catch (err: any) {
      res.status(403).json({ message: err.message });
    }
  }

  static updateOrderStatus(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      const id = String(req.params.id);
      const { status } = updateOrderStatusSchema.parse(req.body);
      const order = OrderService.updateOrderStatus(id, req.user.merchantId, status);
      res.json({ order });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
