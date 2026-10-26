import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ProductController } from '../controllers/product.controller.js';
import { MerchantController } from '../controllers/merchant.controller.js';
import { CartController } from '../controllers/cart.controller.js';
import { CheckoutController } from '../controllers/checkout.controller.js';
import { OrderController } from '../controllers/order.controller.js';
import { AdminController } from '../controllers/admin.controller.js';
import { MiscController } from '../controllers/misc.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// --- IMAGE UPLOAD ---
router.post('/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// --- AUTH ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/me', requireAuth, AuthController.me);

// --- PRODUCTS ---
router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getById);
router.post('/products', requireAuth, requireRole('MERCHANT'), ProductController.create);
router.put('/products/:id', requireAuth, requireRole('MERCHANT'), ProductController.update);
router.delete('/products/:id', requireAuth, requireRole('MERCHANT'), ProductController.delete);

// --- MERCHANTS ---
router.get('/merchants', MerchantController.getAll);
router.get('/merchants/:id', MerchantController.getById);
router.put('/merchants/profile', requireAuth, requireRole('MERCHANT'), MerchantController.updateProfile);
router.get('/merchant/dashboard', requireAuth, requireRole('MERCHANT'), MerchantController.getDashboard);
router.get('/merchant/orders', requireAuth, requireRole('MERCHANT'), MerchantController.getOrders);
router.get('/merchant/orders/:id', requireAuth, requireRole('MERCHANT'), MerchantController.getOrderById);
router.put('/merchant/orders/:id/status', requireAuth, requireRole('MERCHANT'), MerchantController.updateOrderStatus);

// --- CART ---
router.get('/cart', requireAuth, CartController.getCart);
router.post('/cart/items', requireAuth, CartController.addItem);
router.put('/cart/items/:id', requireAuth, CartController.updateItem);
router.delete('/cart/items/:id', requireAuth, CartController.removeItem);
router.delete('/cart', requireAuth, CartController.clearCart);

// --- CHECKOUT & ORDERS ---
router.post('/checkouts', requireAuth, CheckoutController.processCheckout);
router.get('/checkouts/:id', requireAuth, CheckoutController.getCheckoutById);
router.get('/orders', requireAuth, OrderController.getCustomerOrders);
router.get('/orders/:id', requireAuth, OrderController.getCustomerOrderById);

// --- CATEGORIES & NOTIFICATIONS ---
router.get('/categories', MiscController.getCategories);
router.get('/notifications', requireAuth, MiscController.getNotifications);
router.put('/notifications/:id/read', requireAuth, MiscController.markNotificationRead);

// --- ADMIN ---
router.get('/admin/stats', requireAuth, requireRole('ADMIN'), AdminController.getStats);
router.get('/admin/merchants', requireAuth, requireRole('ADMIN'), AdminController.getMerchants);
router.put('/admin/merchants/:id/status', requireAuth, requireRole('ADMIN'), AdminController.updateMerchantStatus);
router.get('/admin/customers', requireAuth, requireRole('ADMIN'), AdminController.getCustomers);
router.get('/admin/orders', requireAuth, requireRole('ADMIN'), AdminController.getAllOrders);
router.get('/admin/checkouts', requireAuth, requireRole('ADMIN'), AdminController.getAllCheckouts);

export default router;
