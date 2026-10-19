import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  User as UserIcon,
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { apiRequest } from '../services/api';
import { Notification } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchCart();
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await apiRequest<{ notifications: Notification[] }>('/notifications');
      setNotifications(data.notifications);
    } catch (err) {
      // ignore
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                K
              </div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">
                Koye<span className="text-brand-600">Mart</span>
              </span>
            </Link>

            <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
              <Link to="/products" className="hover:text-brand-600 transition">
                All Products
              </Link>
              <Link to="/merchants" className="hover:text-brand-600 transition">
                Merchants
              </Link>
              {user && (
                <Link to="/orders" className="hover:text-brand-600 transition">
                  My Orders
                </Link>
              )}
            </nav>
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search products, brands, merchants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {user && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-brand-600 transition rounded-full hover:bg-gray-100"
                title="Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {cart && cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {cart.totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-brand-600 transition rounded-full hover:bg-gray-100"
                  title="Notifications"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-900">Notifications</span>
                      <span className="text-xs text-gray-500">{notifications.length} total</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-500">No notifications yet</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 hover:bg-gray-50 transition cursor-pointer ${
                              !notif.isRead ? 'bg-brand-50/40' : ''
                            }`}
                            onClick={() => {
                              if (notif.linkUrl) navigate(notif.linkUrl);
                              setNotificationsOpen(false);
                            }}
                          >
                            <p className="text-xs font-semibold text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Dashboard links */}
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'MERCHANT' && (
                  <Link
                    to="/merchant"
                    className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Merchant Portal</span>
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{user.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="p-2 text-gray-500 hover:text-rose-600 transition rounded-full hover:bg-gray-100"
                    title="Log out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-brand-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-sm transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-2">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              All Products
            </Link>
            <Link
              to="/merchants"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Merchants
            </Link>
            {user && (
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                My Orders
              </Link>
            )}
            {user?.role === 'MERCHANT' && (
              <Link
                to="/merchant"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-emerald-700 bg-emerald-50 rounded-md"
              >
                Merchant Portal
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-purple-700 bg-purple-50 rounded-md"
              >
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
