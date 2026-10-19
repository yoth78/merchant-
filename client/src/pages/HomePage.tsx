import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  ShieldCheck,
  Truck,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { MerchantCard } from '../components/MerchantCard';
import { Product, Merchant, Category } from '../types';
import { apiRequest } from '../services/api';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, mercRes, catRes] = await Promise.all([
          apiRequest<{ products: Product[] }>('/products'),
          apiRequest<{ merchants: Merchant[] }>('/merchants'),
          apiRequest<{ categories: Category[] }>('/categories')
        ]);
        setFeaturedProducts(prodRes.products.slice(0, 8));
        setMerchants(mercRes.merchants.slice(0, 4));
        setCategories(catRes.categories.slice(0, 6));
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Merchant Unified Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              One Cart. <br />
              <span className="text-emerald-400">Multiple Merchants.</span> <br />
              Instant Order Splitting.
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Shop artisanal goods, high-performance tech, apparel, and home essentials from verified merchants in one seamless checkout. Each merchant independently fulfills your order.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center space-x-2"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/merchants"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/10 backdrop-blur-sm transition flex items-center space-x-2"
              >
                <Store className="w-4 h-4" />
                <span>Browse Merchants</span>
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono text-gray-400">Multi-Merchant Checkout Engine</span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between text-xs text-emerald-300 font-semibold mb-2">
                  <span>Customer Cart (3 Merchants)</span>
                  <span>Total: $150.00</span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex justify-between bg-black/20 p-2 rounded">
                    <span>TechZone: Pro ANC Headphones</span>
                    <span className="font-mono text-emerald-400">$199.99</span>
                  </div>
                  <div className="flex justify-between bg-black/20 p-2 rounded">
                    <span>Urban Aura: Heavyweight Hoodie</span>
                    <span className="font-mono text-emerald-400">$85.00</span>
                  </div>
                  <div className="flex justify-between bg-black/20 p-2 rounded">
                    <span>Organics: Ethiopian Coffee</span>
                    <span className="font-mono text-emerald-400">$22.50</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-gray-400">
                ↓ Auto-Splits Into 3 Independent Merchant Orders Upon Checkout
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Unified Checkout</h4>
              <p className="text-xs text-gray-500 mt-1">Combine products from multiple stores in a single cart.</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Order Splitting</h4>
              <p className="text-xs text-gray-500 mt-1">Automatic order routing to individual merchant stores.</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Cash on Delivery</h4>
              <p className="text-xs text-gray-500 mt-1">Pay safely upon receipt with full status tracking.</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Verified Merchants</h4>
              <p className="text-xs text-gray-500 mt-1">Curated storefronts with inventory guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Merchants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Featured Merchants</h2>
            <p className="text-sm text-gray-500 mt-1">Browse verified independent stores on the marketplace</p>
          </div>
          <Link
            to="/merchants"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      </section>

      {/* Trending / Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Popular Products</h2>
            <p className="text-sm text-gray-500 mt-1">Top-rated items across our merchant community</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-extrabold">Sell on KoyeMart</h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Are you a brand, artisan, or retail business? Register today to launch your customized store, manage inventory, and receive customer orders from day one.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-brand-800 font-bold text-sm rounded-xl hover:bg-gray-100 transition shadow-md"
              >
                <span>Register Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
