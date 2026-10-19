import { Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class OrderController {
  static getCustomerOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = OrderService.getCustomerOrders(req.user!.userId);
      res.json({ orders });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getCustomerOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const order = OrderService.getCustomerOrderById(id, req.user!.userId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.json({ order });
    } catch (err: any) {
      res.status(403).json({ message: err.message });
    }
  }
}
