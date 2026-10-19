import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Store, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { MobileBottomNav } from '../components/MobileBottomNav';

export const MerchantLayout: React.FC = () => {
  const { user } = useAuthStore();

  const links = [
    { to: '/merchant', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/merchant/products', label: 'Products & Inventory', icon: Package },
    { to: '/merchant/orders', label: 'Incoming Orders', icon: ShoppingBag },
    { to: '/merchant/profile', label: 'Store Profile', icon: Store }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
      {/* Top Banner Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-xs font-semibold text-gray-500 hover:text-brand-600 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-gray-900">Merchant Portal</span>
            </div>
          </div>

          <div className="text-xs font-medium text-gray-500">
            Signed in as: <span className="font-bold text-gray-900">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content with Merchant Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar (Desktop) */}
          <aside className="w-full md:w-64 space-y-1">
            <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </aside>

          {/* Subpage Container */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};
