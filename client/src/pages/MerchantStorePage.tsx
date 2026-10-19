import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Store, MapPin, Phone, Package, Search } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Merchant, Product } from '../types';
import { apiRequest } from '../services/api';

export const MerchantStorePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStore() {
      try {
        const data = await apiRequest<{ merchant: Merchant }>(`/merchants/${id}`);
        setMerchant(data.merchant);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading store...</div>;
  }

  if (!merchant) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-500">Merchant store not found.</div>;
  }

  const filteredProducts = (merchant.products || []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="h-48 sm:h-64 bg-gray-900 relative">
        <img
          src={merchant.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'}
          alt={merchant.storeName}
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 border border-gray-200 shadow-md overflow-hidden flex-shrink-0">
              <img
                src={merchant.logoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80'}
                alt={merchant.storeName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {merchant.storeName}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xl mt-1">
                {merchant.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                {merchant.address && (
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {merchant.address}
                  </span>
                )}
                {merchant.phone && (
                  <span className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {merchant.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-100 flex items-center space-x-3">
            <Package className="w-5 h-5 text-emerald-600" />
            <div>
              <span className="block text-xs font-semibold text-emerald-900">
                {merchant.products?.length || 0} Products Listed
              </span>
              <span className="block text-[11px] text-emerald-600">Verified Marketplace Partner</span>
            </div>
          </div>
        </div>

        {/* Search within store */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Store Catalog</h2>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search in this store..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Store Products */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 font-medium text-sm">No products found in this store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  merchant: {
                    id: merchant.id,
                    storeName: merchant.storeName,
                    logoUrl: merchant.logoUrl
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
