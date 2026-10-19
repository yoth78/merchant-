import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, MapPin, ArrowRight } from 'lucide-react';
import { Merchant } from '../types';

interface MerchantCardProps {
  merchant: Merchant;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({ merchant }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Banner / Header Image */}
      <div className="h-28 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
        {merchant.bannerUrl && (
          <img
            src={merchant.bannerUrl}
            alt={merchant.storeName}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>

      {/* Store Logo & Details */}
      <div className="px-5 pb-5 pt-0 flex-1 flex flex-col justify-between relative">
        <div>
          <div className="-mt-10 mb-3 flex items-end justify-between">
            <div className="w-16 h-16 rounded-xl bg-white p-1 border border-gray-100 shadow-md overflow-hidden">
              <img
                src={merchant.logoUrl || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80'}
                alt={merchant.storeName}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            {merchant.productCount !== undefined && (
              <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-full flex items-center">
                <Package className="w-3 h-3 mr-1 text-gray-400" />
                {merchant.productCount} Products
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-900 text-lg group-hover:text-brand-600 transition">
            {merchant.storeName}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {merchant.description || 'Welcome to our verified merchant store.'}
          </p>

          {merchant.address && (
            <p className="text-xs text-gray-400 mt-2 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{merchant.address}</span>
            </p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <Link
            to={`/merchants/${merchant.id}`}
            className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition"
          >
            <span>Visit Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
