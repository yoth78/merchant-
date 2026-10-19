import { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { createProductSchema, updateProductSchema } from '../validators/index.js';

export class ProductController {
  static getAll(req: Request, res: Response) {
    try {
      const { search, categoryId, merchantId, sort } = req.query;
      const products = ProductService.getAll({
        search: search as string,
        categoryId: categoryId as string,
        merchantId: merchantId as string,
        sort: sort as any
      });
      res.json({ products });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const product = ProductService.getById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ product });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static create(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) {
        return res.status(403).json({ message: 'Must be an authorized merchant to create products' });
      }
      const data = createProductSchema.parse(req.body);
      const product = ProductService.create(req.user.merchantId, data);
      res.status(201).json({ product });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static update(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) {
        return res.status(403).json({ message: 'Must be an authorized merchant to update products' });
      }
      const id = String(req.params.id);
      const data = updateProductSchema.parse(req.body);
      const product = ProductService.update(id, req.user.merchantId, data);
      res.json({ product });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static delete(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user?.merchantId) {
        return res.status(403).json({ message: 'Must be an authorized merchant to delete products' });
      }
      const id = String(req.params.id);
      const result = ProductService.delete(id, req.user.merchantId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
