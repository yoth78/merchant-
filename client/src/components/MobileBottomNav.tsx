import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Store, ShieldAlert, User, Clock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

export const MobileBottomNav: React.FC = () => {
  const { user } = useAuthStore();
  const { cart } = useCartStore();

  const totalCartCount = cart?.totalItems || 0;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isActive ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </NavLink>

        {/* Catalog */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isActive ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Shop</span>
        </NavLink>

        {/* Stores */}
        <NavLink
          to="/merchants"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isActive ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Stores</span>
        </NavLink>

        {/* Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition ${
              isActive ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute 0 top-0.5 right-2 bg-brand-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
              {totalCartCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Cart</span>
        </NavLink>

        {/* Orders / Role Tab */}
        {user?.role === 'MERCHANT' ? (
          <NavLink
            to="/merchant"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                isActive ? 'text-emerald-700 font-bold' : 'text-gray-500 hover:text-gray-800'
              }`
            }
          >
            <Store className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] mt-0.5 font-bold">Portal</span>
          </NavLink>
        ) : user?.role === 'ADMIN' ? (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                isActive ? 'text-purple-800 font-bold' : 'text-gray-500 hover:text-gray-800'
              }`
            }
          >
            <ShieldAlert className="w-5 h-5 text-purple-700" />
            <span className="text-[10px] mt-0.5 font-bold">Admin</span>
          </NavLink>
        ) : user ? (
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                isActive ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-800'
              }`
            }
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Orders</span>
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
                isActive ? 'text-brand-600 font-bold' : 'text-gray-500 hover:text-gray-800'
              }`
            }
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Account</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};
