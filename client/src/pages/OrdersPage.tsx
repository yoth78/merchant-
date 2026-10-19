import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, ArrowRight, Clock, ShoppingBag } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Checkout, Order } from '../types';
import { apiRequest } from '../services/api';

interface CheckoutGroup {
  checkout: Checkout;
  orders: Order[];
}

export const OrdersPage: React.FC = () => {
  const [groups, setGroups] = useState<CheckoutGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await apiRequest<{ orders: CheckoutGroup[] }>('/orders');
        setGroups(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading your order history...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">No Orders Yet</h2>
        <p className="text-sm text-gray-500">You haven't placed any orders yet. Check out our merchants' latest products.</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white font-semibold text-xs rounded-xl hover:bg-brand-700 transition shadow-sm"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">My Order History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track fulfillment status across your multi-merchant purchases
        </p>
      </div>

      <div className="space-y-8">
        {groups.map(({ checkout, orders }) => (
          <div
            key={checkout.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Checkout Header */}
            <div className="p-6 bg-gray-50/80 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-base text-gray-900">
                    Checkout #{checkout.orderNumber}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                    {orders.length} Merchant Orders
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Placed on {new Date(checkout.createdAt).toLocaleDateString()} at{' '}
                  {new Date(checkout.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-400 block font-medium">Session Total</span>
                <span className="text-lg font-extrabold text-brand-700">
                  ${Number(checkout.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Sub-Orders list */}
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50/40 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                        <Store className="w-4 h-4 text-brand-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">
                          {order.merchantName || 'Merchant'}
                        </h4>
                        <span className="text-xs text-gray-400">
                          Order #{order.orderNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <StatusBadge status={order.status} />
                      <Link
                        to={`/orders/${order.id}`}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold text-gray-700 rounded-xl hover:border-brand-500 hover:text-brand-600 transition flex items-center space-x-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="pt-3 space-y-1.5 text-xs text-gray-600">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                          <span>{item.productName}</span>
                          <span className="text-gray-400">× {item.quantity}</span>
                        </div>
                        <span className="font-mono font-medium">${Number(item.totalPrice).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
