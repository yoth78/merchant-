import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { apiRequest } from '../../services/api';
import { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await apiRequest<{ orders: Order[] }>('/admin/orders');
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">All Marketplace Orders</h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete cross-merchant order stream
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Order</th>
                  <th className="py-3.5 px-4">Merchant</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">#{o.orderNumber}</td>
                    <td className="py-4 px-4 font-semibold text-gray-800">{o.merchantName}</td>
                    <td className="py-4 px-4 text-gray-700">{o.customerName}</td>
                    <td className="py-4 px-4 text-gray-600">{o.items?.length || 0} item(s)</td>
                    <td className="py-4 px-4 font-mono font-bold text-gray-900">${Number(o.totalAmount).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
