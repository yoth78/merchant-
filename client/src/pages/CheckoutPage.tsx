import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, CheckCircle, ShieldCheck, ArrowRight, Loader2, Building2, Layers, Home, MapPin } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { apiRequest } from '../services/api';

const CONDO_SITES = [
  'Koye Feche Condominium',
  'Ayat Condominium',
  'Jomo Condominium',
  'Bole Arabsa Condominium',
  'Summit Condominium',
  'Tulu Dimtu Condominium',
  'Gelan Condominium',
  'Gotera Condominium',
  'Balderas Condominium',
  'Yeka Abado Condominium',
  'Lideta Condominium',
  'Sengatera Condominium',
  'Other Condominium Site'
];

const FLOOR_OPTIONS = [
  'Ground Floor',
  '1st Floor',
  '2nd Floor',
  '3rd Floor',
  '4th Floor',
  '5th Floor',
  '6th Floor',
  '7th Floor',
  '8th Floor',
  '9th Floor',
  '10th Floor',
  'Other Floor'
];

export const CheckoutPage: React.FC = () => {
  const { cart, fetchCart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+251 91 123 4567');
  
  // Condominium address specific fields
  const [condoSite, setCondoSite] = useState('Koye Feche Condominium');
  const [customCondoSite, setCustomCondoSite] = useState('');
  const [blockNumber, setBlockNumber] = useState('90');
  const [floorLevel, setFloorLevel] = useState('4th Floor');
  const [houseNumber, setHouseNumber] = useState('21');
  const [entranceLandmark, setEntranceLandmark] = useState('');

  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const compiledAddress = (() => {
    const site = condoSite === 'Other Condominium Site' ? customCondoSite.trim() : condoSite.trim();
    const blk = blockNumber.trim() ? (blockNumber.toLowerCase().startsWith('block') ? blockNumber.trim() : `Block ${blockNumber.trim()}`) : '';
    const flr = floorLevel.trim();
    const house = houseNumber.trim() ? (houseNumber.toLowerCase().startsWith('house') ? houseNumber.trim() : `House No. ${houseNumber.trim()}`) : '';
    const ent = entranceLandmark.trim() ? `(${entranceLandmark.trim()})` : '';

    return [site, blk, flr, house, ent].filter(Boolean).join(', ');
  })();

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

    const effectiveSite = condoSite === 'Other Condominium Site' ? customCondoSite.trim() : condoSite.trim();
    if (!effectiveSite) {
      setErrorMessage('Please specify your Condominium Site name.');
      return;
    }
    if (!blockNumber.trim()) {
      setErrorMessage('Please provide your exact Block number (e.g. Block 90).');
      return;
    }
    if (!floorLevel.trim()) {
      setErrorMessage('Please select your Floor level (e.g. 4th Floor).');
      return;
    }
    if (!houseNumber.trim()) {
      setErrorMessage('Please provide your exact House / Flat number (e.g. House No. 21).');
      return;
    }

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
          deliveryAddress: compiledAddress,
          deliveryNotes: deliveryNotes.trim() || undefined,
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
          Complete your exact condominium delivery details. Your order will be automatically split into individual orders for each merchant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Condominium Delivery Details</h2>
                <p className="text-xs text-gray-500">Provide exact Block, Floor, and House Number for accurate doorstep delivery</p>
              </div>
            </div>

            {/* Recipient Details */}
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
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number (for Delivery Call) *
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +251 91 123 4567"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Condominium Structured Fields */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-2xl border border-emerald-100/80 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>Condominium Location Specs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Site Selection */}
                <div className={condoSite === 'Other Condominium Site' ? 'sm:col-span-1' : 'sm:col-span-2'}>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Condominium Site / Area *
                  </label>
                  <select
                    value={condoSite}
                    onChange={(e) => setCondoSite(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {CONDO_SITES.map((site) => (
                      <option key={site} value={site}>{site}</option>
                    ))}
                  </select>
                </div>

                {/* Custom site name if Other is chosen */}
                {condoSite === 'Other Condominium Site' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Specify Condominium Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Semmit Condominium Site 2"
                      value={customCondoSite}
                      onChange={(e) => setCustomCondoSite(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                )}

                {/* Block Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>Exact Block Number *</span>
                    <span className="text-[10px] text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">Required</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400">Blk</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 90"
                      value={blockNumber}
                      onChange={(e) => setBlockNumber(e.target.value)}
                      className="w-full pl-11 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Floor Level */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>Floor Level *</span>
                    <span className="text-[10px] text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">Required</span>
                  </label>
                  <select
                    value={floorLevel}
                    onChange={(e) => setFloorLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {FLOOR_OPTIONS.map((flr) => (
                      <option key={flr} value={flr}>{flr}</option>
                    ))}
                  </select>
                </div>

                {/* House Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>House / Flat Number *</span>
                    <span className="text-[10px] text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-full">Required</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400">No.</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 21"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      className="w-full pl-11 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Building Entrance / Staircase / Landmark */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Entrance / Staircase (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Entrance B, left staircase"
                    value={entranceLandmark}
                    onChange={(e) => setEntranceLandmark(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Formatted Address Preview */}
              <div className="mt-3 p-3.5 bg-white/90 rounded-xl border border-emerald-200/80 shadow-xs flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-gray-900 block">Formatted Doorstep Delivery Address:</span>
                  <p className="font-mono text-xs font-semibold text-brand-800 bg-brand-50/80 px-2 py-1 rounded-lg border border-brand-100 inline-block">
                    {compiledAddress || 'Please fill in block and house number'}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Additional Delivery Notes / Courier Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Please ring doorbell twice, gate guard will allow entry"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
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
                  Pay securely with cash or mobile money upon package delivery directly at your condominium door.
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
