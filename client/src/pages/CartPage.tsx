import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Store, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

export const CartPage: React.FC = () => {
  const { cart, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Sign in to view your cart</h2>
        <p className="text-sm text-gray-500">Your cart persists across sessions once logged in.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 transition"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (isLoading && !cart) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading your cart...</div>;
  }

  const isEmpty = !cart || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500">
          Looks like you haven't added anything to your cart yet. Explore products from our merchants!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 text-white font-semibold text-sm rounded-xl hover:bg-brand-700 transition shadow-sm"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Your Shopping Cart</h1>
        <p className="text-sm text-gray-500 mt-1">
          Items are grouped by merchant. You will check out in one step, and orders will be created automatically for each merchant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items Grouped by Merchant */}
        <div className="lg:col-span-2 space-y-6">
          {cart.groups.map((group) => (
            <div
              key={group.merchantId}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Merchant Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-white p-1 border border-gray-200 shadow-xs overflow-hidden flex items-center justify-center">
                    {group.merchantLogo ? (
                      <img src={group.merchantLogo} alt={group.merchantName} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{group.merchantName}</h3>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Fulfills {group.items.length} item(s) in this order
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-medium">Merchant Subtotal</span>
                  <span className="text-sm font-extrabold text-gray-900">
                    ${group.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items for this Merchant */}
              <div className="p-6 divide-y divide-gray-100">
                {group.items.map((item) => {
                  if (!item.product) return null;
                  return (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.productId}`}
                          className="text-sm font-semibold text-gray-900 hover:text-brand-600 transition block truncate"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ${Number(item.product.price).toFixed(2)} each
                        </p>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          In stock ({item.product.stock} available)
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded flex items-center justify-center text-gray-600 hover:bg-white text-xs font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-7 h-7 rounded flex items-center justify-center text-gray-600 hover:bg-white text-xs font-bold disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="w-20 text-right">
                        <span className="text-sm font-bold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Checkout Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6 sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Total Items</span>
              <span className="font-semibold text-gray-900">{cart.totalItems}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Merchants Involved</span>
              <span className="font-semibold text-gray-900">{cart.groups.length} Stores</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Delivery</span>
              <span className="font-semibold text-emerald-600">Free (COD)</span>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
              <span>Checkout Total</span>
              <span className="text-xl text-brand-700">${cart.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-brand-50/70 p-3.5 rounded-2xl border border-brand-100 text-xs text-brand-800 space-y-1">
            <p className="font-bold">Multi-Merchant Checkout Notice</p>
            <p className="text-[11px] leading-relaxed">
              Upon checkout, this cart will automatically split into {cart.groups.length} separate orders for each merchant.
            </p>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-600/20 transition flex items-center justify-center space-x-2 text-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
