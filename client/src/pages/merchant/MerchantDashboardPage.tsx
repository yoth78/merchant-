import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  DollarSign,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Store
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { apiRequest } from '../../services/api';
import { Order, Product } from '../../types';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSales: number;
  totalProducts: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
}

export const MerchantDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await apiRequest<{ stats: DashboardStats }>('/merchant/dashboard');
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading merchant metrics...</div>;
  }

  if (!stats) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-500">Failed to load dashboard.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Merchant Store Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your store sales, incoming orders, and inventory status
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Sales</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              ${stats.totalSales.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {stats.totalOrders}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-0.5">
              {stats.pendingOrders}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Catalog Items</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {stats.totalProducts}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Recent Customer Orders</h2>
            <Link
              to="/merchant/orders"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <span>Manage Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No incoming orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-gray-900">#{o.orderNumber}</span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {o.customerName} • {o.items?.length || 0} item(s)
                    </p>
                  </div>

                  <div className="text-right flex items-center space-x-4">
                    <span className="font-mono font-bold text-xs text-gray-900">
                      ${Number(o.totalAmount).toFixed(2)}
                    </span>
                    <Link
                      to={`/merchant/orders/${o.id}`}
                      className="px-3 py-1 bg-gray-50 hover:bg-brand-50 hover:text-brand-600 text-gray-700 rounded-lg text-xs font-semibold transition"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-gray-900">Low Stock Alert</h2>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {stats.lowStockCount} items
            </span>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">All product stocks are healthy (10+).</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                    <span className="text-[11px] text-amber-700 font-semibold">
                      Stock remaining: {p.stock}
                    </span>
                  </div>
                  <Link
                    to={`/merchant/products/${p.id}/edit`}
                    className="text-[11px] font-bold text-brand-700 hover:underline flex-shrink-0"
                  >
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
