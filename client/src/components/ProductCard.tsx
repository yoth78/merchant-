import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Store } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, isLoading } = useCartStore();
  const { user } = useAuthStore();
  const [added, setAdded] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      setErrorMsg('');
      await addItem(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Cannot add item');
      setTimeout(() => setErrorMsg(''), 2500);
    }
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="relative block aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Merchant link */}
          {product.merchant && (
            <Link
              to={`/merchants/${product.merchant.id}`}
              className="inline-flex items-center text-xs text-gray-500 hover:text-brand-600 font-medium mb-1 transition"
            >
              <Store className="w-3 h-3 mr-1 text-gray-400" />
              {product.merchant.storeName}
            </Link>
          )}

          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition text-sm sm:text-base line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-gray-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              added
                ? 'bg-emerald-600 text-white'
                : product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm active:scale-95'
            }`}
            title="Add to cart"
          >
            {added ? (
              <Check className="w-5 h-5 animate-pulse" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>

        {errorMsg && (
          <p className="text-[11px] text-rose-500 font-medium mt-1 text-center">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
};
