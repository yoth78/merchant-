import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, ShoppingCart, Check, ShieldCheck, ArrowLeft, Truck, Package } from 'lucide-react';
import { Product } from '../types';
import { apiRequest } from '../services/api';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { addItem, isLoading } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await apiRequest<{ product: Product }>(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (!product) return;

    try {
      setErrorMsg('');
      await addItem(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not add product to cart');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center text-gray-400">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <p className="text-gray-500 font-medium">Product not found.</p>
        <Link to="/products" className="text-brand-600 font-semibold underline mt-2 block">
          Back to all products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/products"
        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        {/* Product Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Merchant Badge */}
            {product.merchant && (
              <Link
                to={`/merchants/${product.merchant.id}`}
                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200/60 hover:border-brand-500 transition text-xs font-semibold text-gray-700"
              >
                <Store className="w-3.5 h-3.5 text-brand-600" />
                <span>Sold by: <span className="text-brand-700 font-bold">{product.merchant.storeName}</span></span>
              </Link>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-extrabold text-brand-700">
              ${Number(product.price).toFixed(2)}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-gray-500">
              <span className={`font-semibold px-2.5 py-1 rounded-full ${
                product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
              {product.category && (
                <span className="bg-gray-100 px-2.5 py-1 rounded-full text-gray-600 font-medium">
                  {product.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Cart Quantity & Action */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            {product.stock > 0 ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white transition font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition shadow-md ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-98'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 animate-pulse" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart (${(product.price * quantity).toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-sm font-semibold text-gray-500">
                This item is currently sold out.
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Cash on Delivery Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Merchant Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
