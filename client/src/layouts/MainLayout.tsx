import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { MobileBottomNav } from '../components/MobileBottomNav';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <span className="font-extrabold text-lg text-gray-900 tracking-tight">
                  Koye<span className="text-brand-600">Mart</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                A modern multi-merchant e-commerce marketplace empowering independent vendors and verified merchants.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Marketplace</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/products" className="hover:text-brand-600">All Products</a></li>
                <li><a href="/merchants" className="hover:text-brand-600">Browse Merchants</a></li>
                <li><a href="/cart" className="hover:text-brand-600">Shopping Cart</a></li>
                <li><a href="/orders" className="hover:text-brand-600">Order Tracking</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Vendors</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/register" className="hover:text-brand-600">Become a Merchant</a></li>
                <li><a href="/merchant" className="hover:text-brand-600">Merchant Portal</a></li>
                <li><a href="/merchant/products" className="hover:text-brand-600">Inventory Management</a></li>
                <li><a href="/merchant/orders" className="hover:text-brand-600">Merchant Orders</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">MVP Guarantee</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Multi-merchant order splitting engine: One cart checkout automatically routes to independent merchant fulfillment workflows.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
            <p>© 2026 KoyeMart Platform. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Production-Ready Multi-Merchant App</p>
          </div>
        </div>
      </footer>

      {/* Native-like Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
