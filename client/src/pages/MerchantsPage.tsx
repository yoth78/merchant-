import React, { useEffect, useState } from 'react';
import { MerchantCard } from '../components/MerchantCard';
import { Merchant } from '../types';
import { apiRequest } from '../services/api';

export const MerchantsPage: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMerchants() {
      try {
        const data = await apiRequest<{ merchants: Merchant[] }>('/merchants');
        setMerchants(data.merchants);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMerchants();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Merchants & Stores</h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover all independent stores powering the marketplace
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      )}
    </div>
  );
};
