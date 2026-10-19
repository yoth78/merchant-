import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Store, Users, ShoppingBag, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { MobileBottomNav } from '../components/MobileBottomNav';

export const AdminLayout: React.FC = () => {
  const { user } = useAuthStore();

  const links = [
    { to: '/admin', label: 'Platform Stats', icon: LayoutDashboard, end: true },
    { to: '/admin/merchants', label: 'Merchants & Moderation', icon: Store },
    { to: '/admin/orders', label: 'All Orders', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Registered Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 md:pb-0">
      <header className="bg-purple-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-xs font-semibold text-purple-200 hover:text-white flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="h-4 w-px bg-purple-700" />
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-bold tracking-wide">KoyeMart SuperAdmin</span>
            </div>
          </div>

          <div className="text-xs font-medium text-purple-200">
            Administrator: <span className="font-bold text-white">{user?.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex flex-col md:flex-row gap-8">
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
                          ? 'bg-purple-50 text-purple-800'
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

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};
