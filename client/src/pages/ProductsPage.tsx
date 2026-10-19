import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product, Category, Merchant } from '../types';
import { apiRequest } from '../services/api';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialMerchant = searchParams.get('merchant') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMerchant, setSelectedMerchant] = useState(initialMerchant);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, mercRes] = await Promise.all([
          apiRequest<{ categories: Category[] }>('/categories'),
          apiRequest<{ merchants: Merchant[] }>('/merchants')
        ]);
        setCategories(catRes.categories);
        setMerchants(mercRes.merchants);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (selectedCategory) query.set('categoryId', selectedCategory);
        if (selectedMerchant) query.set('merchantId', selectedMerchant);
        if (selectedSort) query.set('sort', selectedSort);

        const data = await apiRequest<{ products: Product[] }>(`/products?${query.toString()}`);
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [search, selectedCategory, selectedMerchant, selectedSort]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedMerchant('');
    setSelectedSort('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Explore Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse high quality products across multiple verified merchants
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="font-bold text-sm text-gray-900 flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-brand-600" />
              Filters
            </span>
            {(selectedCategory || selectedMerchant || search) && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Category
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                  selectedCategory === ''
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                    selectedCategory === cat.id
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Merchants */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Merchant Store
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedMerchant('')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                  selectedMerchant === ''
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Merchants
              </button>
              {merchants.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMerchant(m.id)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                    selectedMerchant === m.id
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {m.storeName}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No products match your current filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
