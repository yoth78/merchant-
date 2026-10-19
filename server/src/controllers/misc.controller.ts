import { Request, Response } from 'express';
import { db } from '../database/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class MiscController {
  static getCategories(_req: Request, res: Response) {
    try {
      const store = db.get();
      res.json({ categories: store.categories });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const store = db.get();
      const notifs = store.notifications
        .filter(n => n.userId === req.user!.userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ notifications: notifs });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static markNotificationRead(req: AuthenticatedRequest, res: Response) {
    try {
      const store = db.get();
      const notif = store.notifications.find(n => n.id === req.params.id && n.userId === req.user!.userId);
      if (notif) {
        notif.isRead = true;
        db.save(store);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
