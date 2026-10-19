import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await AuthService.register(data);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ message: err.message || 'Login failed' });
    }
  }

  static async me(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await AuthService.getMe(req.user.userId);
      res.json({ user });
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  static async logout(_req: Request, res: Response) {
    res.json({ message: 'Logged out successfully' });
  }
}
