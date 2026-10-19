import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { MerchantLayout } from './layouts/MerchantLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public / Customer Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { MerchantsPage } from './pages/MerchantsPage';
import { MerchantStorePage } from './pages/MerchantStorePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutConfirmationPage } from './pages/CheckoutConfirmationPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Merchant Pages
import { MerchantDashboardPage } from './pages/merchant/MerchantDashboardPage';
import { MerchantProductsPage } from './pages/merchant/MerchantProductsPage';
import { MerchantProductFormPage } from './pages/merchant/MerchantProductFormPage';
import { MerchantOrdersPage } from './pages/merchant/MerchantOrdersPage';
import { MerchantOrderDetailPage } from './pages/merchant/MerchantOrderDetailPage';
import { MerchantProfilePage } from './pages/merchant/MerchantProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminMerchantsPage } from './pages/admin/AdminMerchantsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';

import { useAuthStore } from './stores/authStore';

// Protected Route wrappers
const ProtectedMerchantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  if (!user || user.role !== 'MERCHANT') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketplace Storefront & Customer routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="merchants" element={<MerchantsPage />} />
          <Route path="merchants/:id" element={<MerchantStorePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/:id" element={<CheckoutConfirmationPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Merchant Portal */}
        <Route
          path="/merchant"
          element={
            <ProtectedMerchantRoute>
              <MerchantLayout />
            </ProtectedMerchantRoute>
          }
        >
          <Route index element={<MerchantDashboardPage />} />
          <Route path="products" element={<MerchantProductsPage />} />
          <Route path="products/new" element={<MerchantProductFormPage />} />
          <Route path="products/:id/edit" element={<MerchantProductFormPage />} />
          <Route path="orders" element={<MerchantOrdersPage />} />
          <Route path="orders/:id" element={<MerchantOrderDetailPage />} />
          <Route path="profile" element={<MerchantProfilePage />} />
        </Route>

        {/* Admin Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="merchants" element={<AdminMerchantsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
