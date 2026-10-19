import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, CheckCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { apiRequest } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { cart, fetchCart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1 555-0199');
  const [deliveryAddress, setDeliveryAddress] = useState('123 Innovation Blvd, Apt 4B, Silicon Valley, CA');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mt-1">Please add products before checking out.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-2.5 bg-brand-600 text-white font-semibold text-xs rounded-xl"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await apiRequest<{
        checkout: { id: string; orderNumber: string };
        orders: any[];
      }>('/checkouts', {
        method: 'POST',
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryAddress,
          deliveryNotes,
          paymentMethod: 'COD'
        })
      });

      // Navigate to checkout confirmation
      navigate(`/checkout/${response.checkout.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Checkout failed. Please review your cart.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Unified Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">
          Complete your delivery details. Your order will be automatically split into individual orders for each merchant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h2 className="text-lg font-bold text-gray-900">Delivery Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Delivery Notes / Special Instructions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave with security guard, gate code #1234"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
            </div>

            <div className="border-2 border-brand-500 bg-brand-50/40 p-4 rounded-2xl flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked
                readOnly
                className="mt-1 text-brand-600 focus:ring-brand-500"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">Cash on Delivery (COD)</span>
                  <span className="text-xs bg-brand-100 text-brand-800 font-semibold px-2 py-0.5 rounded-full">
                    Recommended MVP
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Pay securely with cash or card upon package handover. No card pre-authorization required.
                </p>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-2xl shadow-xl shadow-brand-600/25 transition flex items-center justify-center space-x-2 text-base disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order Splitting...</span>
              </>
            ) : (
              <>
                <span>Place Order (${cart.totalAmount.toFixed(2)})</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Multi-Merchant Split Summary Preview */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
            Order Split Breakdown
          </h3>

          <p className="text-xs text-gray-500">
            Because this cart contains items from <span className="font-bold text-gray-900">{cart.groups.length} merchants</span>, our system will generate separate fulfillment orders:
          </p>

          <div className="space-y-4">
            {cart.groups.map((group, idx) => (
              <div key={group.merchantId} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                  <div className="flex items-center space-x-1.5">
                    <Store className="w-3.5 h-3.5 text-brand-600" />
                    <span>Order #{idx + 1}: {group.merchantName}</span>
                  </div>
                  <span className="font-mono text-brand-700">${group.subtotal.toFixed(2)}</span>
                </div>

                <div className="text-[11px] text-gray-500 space-y-1">
                  {group.items.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span className="truncate pr-2">{i.product?.name} × {i.quantity}</span>
                      <span className="font-mono font-medium">${((i.product?.price || 0) * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span className="font-semibold text-gray-900">${cart.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-100">
              <span>Grand Total</span>
              <span className="text-brand-700">${cart.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
