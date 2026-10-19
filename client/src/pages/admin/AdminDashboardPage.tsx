import React, { useEffect, useState } from 'react';
import { Users, Store, Package, ShoppingBag, DollarSign, Layers } from 'lucide-react';
import { apiRequest } from '../../services/api';

interface AdminStats {
  totalCustomers: number;
  totalMerchants: number;
  totalProducts: number;
  totalOrders: number;
  totalCheckouts: number;
  totalSales: number;
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiRequest<{ stats: AdminStats }>('/admin/stats');
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-400">Loading admin analytics...</div>;
  }

  if (!stats) {
    return <div className="p-12 text-center text-xs text-gray-500">Failed to load platform stats.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Platform Analytics & Governance</h1>
        <p className="text-xs text-gray-500 mt-1">
          Global marketplace activity across all vendors, buyers, and orders
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Gross Merchandise Value</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              ${stats.totalSales.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Merchants</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {stats.totalMerchants} Stores
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Registered Buyers</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {stats.totalCustomers} Customers
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Checkout Sessions</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {stats.totalCheckouts} Sessions
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Split Orders</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {stats.totalOrders} Orders
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Listed Products</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {stats.totalProducts} Items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
