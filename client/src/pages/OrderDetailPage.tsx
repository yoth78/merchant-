import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, ArrowLeft, Package, MapPin, Phone, Clock, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Order } from '../types';
import { apiRequest } from '../services/api';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await apiRequest<{ order: Order }>(`/orders/${id}`);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading order details...</div>;
  }

  if (!order) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-500">Order not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/orders"
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 block font-medium">Order Subtotal</span>
            <span className="text-2xl font-extrabold text-brand-700">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Merchant Store info */}
        {order.merchant && (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-gray-200 overflow-hidden">
                <img
                  src={order.merchant.logoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80'}
                  alt={order.merchant.storeName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{order.merchant.storeName}</h3>
                <span className="text-xs text-gray-500">Merchant store fulfilling this order</span>
              </div>
            </div>

            <Link
              to={`/merchants/${order.merchant.id}`}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
            >
              View Storefront
            </Link>
          </div>
        )}

        {/* Items */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">Ordered Products</h2>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-4">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">{item.productName}</h4>
                    <p className="text-xs text-gray-500">
                      ${Number(item.unitPrice).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>

                <span className="font-mono font-bold text-sm text-gray-900">
                  ${Number(item.totalPrice).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-gray-900 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
              Delivery Address
            </span>
            <p className="text-gray-600">{order.customerName}</p>
            <p className="text-gray-600">{order.deliveryAddress}</p>
            {order.deliveryNotes && (
              <p className="text-gray-500 italic mt-1">Note: {order.deliveryNotes}</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="font-bold text-gray-900 flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
              Contact Information
            </span>
            <p className="text-gray-600">{order.customerPhone}</p>
            <p className="text-emerald-600 font-semibold mt-1">Payment Method: Cash on Delivery (COD)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
