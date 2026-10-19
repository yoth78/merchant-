import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';

export class AdminController {
  static getStats(_req: Request, res: Response) {
    try {
      const stats = AdminService.getStats();
      res.json({ stats });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getMerchants(_req: Request, res: Response) {
    try {
      const merchants = AdminService.getMerchants();
      res.json({ merchants });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static updateMerchantStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const merchant = AdminService.updateMerchantStatus(id, status);
      res.json({ merchant });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static getCustomers(_req: Request, res: Response) {
    try {
      const customers = AdminService.getCustomers();
      res.json({ customers });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getAllOrders(_req: Request, res: Response) {
    try {
      const orders = AdminService.getAllOrders();
      res.json({ orders });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getAllCheckouts(_req: Request, res: Response) {
    try {
      const checkouts = AdminService.getAllCheckouts();
      res.json({ checkouts });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
