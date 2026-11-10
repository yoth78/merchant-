import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Phone, Clock, Save, Loader2 } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { Order, OrderStatus } from '../../types';
import { apiRequest } from '../../services/api';

export const MerchantOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>('PENDING');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await apiRequest<{ order: Order }>(`/merchant/orders/${id}`);
        setOrder(data.order);
        setStatus(data.order.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handleSaveStatus = async () => {
    setUpdating(true);
    setSuccessMsg('');
    try {
      const data = await apiRequest<{ order: Order }>(`/merchant/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setOrder(data.order);
      setSuccessMsg('Status updated successfully!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-400">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-12 text-center text-xs text-gray-500">Order not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/merchant/orders"
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-extrabold text-gray-900">
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
            <span className="text-xl font-extrabold text-brand-700">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Update status panel */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Fulfillment Status Workflow
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 flex-1"
            >
              <option value="PENDING">PENDING — Waiting for merchant review</option>
              <option value="ACCEPTED">ACCEPTED — Store confirmed the order</option>
              <option value="PREPARING">PREPARING — Packaging items</option>
              <option value="READY">READY — Ready for dispatch / pickup</option>
              <option value="DELIVERED">DELIVERED — Handed over & COD collected</option>
              <option value="CANCELLED">CANCELLED — Rejected / Out of stock</option>
            </select>

            <button
              onClick={handleSaveStatus}
              disabled={updating || status === order.status}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 disabled:opacity-40"
            >
              {updating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Status</span>
                </>
              )}
            </button>
          </div>

          {successMsg && (
            <p className="text-xs text-emerald-600 font-semibold">{successMsg}</p>
          )}
        </div>

        {/* Items to fulfill */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Items to Pack ({order.items?.length || 0})
          </h2>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-4">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">{item.productName}</h4>
                    <p className="text-[11px] text-gray-500">
                      ${Number(item.unitPrice).toFixed(2)} × {item.quantity} units
                    </p>
                  </div>
                </div>

                <span className="font-mono font-bold text-xs text-gray-900">
                  ${Number(item.totalPrice).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Shipping information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
          <div className="space-y-1.5">
            <span className="font-bold text-gray-900 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-brand-600" />
              Condominium Delivery Destination
            </span>
            <p className="text-gray-900 font-bold">{order.customerName}</p>
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
              <p className="text-emerald-950 font-mono font-bold text-xs">{order.deliveryAddress}</p>
            </div>
            {order.deliveryNotes && (
              <p className="text-gray-500 italic text-[11px]">Courier note: {order.deliveryNotes}</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="font-bold text-gray-900 flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
              Contact
            </span>
            <p className="text-gray-700">{order.customerPhone}</p>
            <p className="text-emerald-700 font-semibold mt-1">Payment Method: Cash on Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
};
