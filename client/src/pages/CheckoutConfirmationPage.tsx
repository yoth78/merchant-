import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Store, Package, ArrowRight, Clock, MapPin } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Checkout, Order } from '../types';
import { apiRequest } from '../services/api';

export const CheckoutConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const data = await apiRequest<{ checkout: Checkout; orders: Order[] }>(`/checkouts/${id}`);
        setCheckout(data.checkout);
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading checkout confirmation...</div>;
  }

  if (!checkout) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-500">Checkout session not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Hero */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Order Successfully Placed!
        </h1>

        <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          Thank you for your purchase, <span className="font-semibold text-gray-900">{checkout.customerName}</span>. Your multi-merchant checkout has been split into individual merchant orders.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-xs">
            <span className="text-gray-500">Checkout Session:</span>
            <span className="font-mono font-bold text-gray-900">#{checkout.orderNumber}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">Total:</span>
            <span className="font-mono font-bold text-brand-700">${Number(checkout.totalAmount).toFixed(2)}</span>
          </div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-900 px-4 py-2 rounded-xl border border-emerald-200 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Condo Delivery: <strong className="font-mono">{checkout.deliveryAddress}</strong></span>
          </div>
        </div>
      </div>

      {/* Split Orders List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Split Merchant Orders ({orders.length})
          </h2>
          <span className="text-xs text-gray-500">Each store manages its own fulfillment</span>
        </div>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Merchant / Order Header */}
            <div className="p-6 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white p-1 border border-gray-200 shadow-xs flex items-center justify-center">
                  <Store className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{order.merchantName || 'Merchant Store'}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>Order #{order.orderNumber}</span>
                    <span>•</span>
                    <span>COD</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={order.status} />
                <Link
                  to={`/orders/${order.id}`}
                  className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 hover:text-brand-600 hover:border-brand-500 font-semibold text-xs rounded-xl transition shadow-xs flex items-center space-x-1"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 divide-y divide-gray-50">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">{item.productName}</span>
                    <span className="text-gray-400">× {item.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-gray-900">
                    ${Number(item.totalPrice).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="pt-4 mt-2 flex justify-between items-center text-xs">
                <span className="text-gray-500">Delivery to: {order.deliveryAddress}</span>
                <span className="font-bold text-sm text-gray-900">
                  Subtotal: ${Number(order.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          to="/orders"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-brand-700 transition"
        >
          <span>View All My Orders</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
