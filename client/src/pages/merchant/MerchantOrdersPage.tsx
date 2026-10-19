import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Filter, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { Order, OrderStatus } from '../../types';
import { apiRequest } from '../../services/api';

export const MerchantOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const url = selectedStatus
        ? `/merchant/orders?status=${selectedStatus}`
        : '/merchant/orders';
      const data = await apiRequest<{ orders: Order[] }>(url);
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await apiRequest(`/merchant/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Store Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Fulfill and update status for orders placed specifically with your merchant store
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading incoming orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Package className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500 font-medium">No orders found matching this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Order</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-6 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900 block">#{order.orderNumber}</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900 block">{order.customerName}</span>
                      <span className="text-[10px] text-gray-400 truncate max-w-xs block">
                        {order.deliveryAddress}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700 font-medium">{order.items?.length || 0} product(s)</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-gray-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="PREPARING">PREPARING</option>
                          <option value="READY">READY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>

                        <Link
                          to={`/merchant/orders/${order.id}`}
                          className="p-1 text-brand-600 hover:text-brand-800"
                          title="View Order Details"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
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
