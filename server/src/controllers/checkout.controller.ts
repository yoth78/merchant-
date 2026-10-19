import { Response } from 'express';
import { CheckoutService } from '../services/checkout.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { checkoutSchema } from '../validators/index.js';

export class CheckoutController {
  static processCheckout(req: AuthenticatedRequest, res: Response) {
    try {
      const data = checkoutSchema.parse(req.body);
      const result = CheckoutService.processCheckout({
        customerId: req.user!.userId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        deliveryAddress: data.deliveryAddress,
        deliveryNotes: data.deliveryNotes,
        paymentMethod: data.paymentMethod
      });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static getCheckoutById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = String(req.params.id);
      const result = CheckoutService.getCheckoutById(
        id,
        req.user?.role === 'ADMIN' ? undefined : req.user!.userId
      );
      if (!result) {
        return res.status(404).json({ message: 'Checkout session not found' });
      }
      res.json(result);
    } catch (err: any) {
      res.status(403).json({ message: err.message });
    }
  }
}
