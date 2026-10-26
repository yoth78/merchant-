import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, Sparkles, Image as ImageIcon, Eye, CheckCircle2 } from 'lucide-react';
import { Category } from '../../types';
import { apiRequest } from '../../services/api';

export const MerchantProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const catRes = await apiRequest<{ categories: Category[] }>('/categories');
        setCategories(catRes.categories);
        if (catRes.categories.length > 0 && !categoryId) {
          setCategoryId(catRes.categories[0].id);
        }

        if (isEditing && id) {
          setLoading(true);
          const prodRes = await apiRequest<{ product: any }>(`/products/${id}`);
          const p = prodRes.product;
          setName(p.name);
          setDescription(p.description);
          setPrice(String(p.price));
          setStock(String(p.stock));
          setCategoryId(p.categoryId || '');
          setImageUrl(p.imageUrl || '');
          setIsActive(p.isActive);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isEditing]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Image upload failed');
      }

      const data = await response.json();
      setImageUrl(data.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const payload = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryId: categoryId || undefined,
        imageUrl: imageUrl || undefined,
        isActive
      };

      if (isEditing && id) {
        await apiRequest(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest('/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      navigate('/merchant/products');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-400">Loading form...</div>;
  }

  const selectedCategoryObj = categories.find(c => c.id === categoryId);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <Link
          to="/merchant/products"
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Store Products
        </Link>
        <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Merchant Publishing Portal
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {isEditing ? 'Edit Item Details' : 'Post New Item to Store'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              List your product on KoyeMart. Buyers will be able to discover and purchase it directly from your storefront.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Description & Highlights *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key features, sizing, technical specifications, and condition..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Price ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 text-xs sm:text-sm font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29.99"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Inventory Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition font-mono font-medium"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition font-medium"
              >
                <option value="">Select a Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Product Image</label>
              
              <div className="border-2 border-dashed border-gray-200 hover:border-brand-500 rounded-2xl p-4 transition bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Upload from Computer or Phone</p>
                    <p className="text-[11px] text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 hover:border-brand-500 text-gray-700 font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Or Direct Image URL */}
              <div className="pt-1">
                <span className="text-[11px] text-gray-400 font-medium block mb-1">Or paste an Image URL:</span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-gray-600"
                />
              </div>
            </div>

            {/* Visibility checkbox */}
            <div className="pt-2 flex items-center space-x-2.5 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <label htmlFor="isActive" className="text-xs font-semibold text-gray-700 cursor-pointer">
                Publish item immediately (Visible to all marketplace customers)
              </label>
            </div>

            {/* Form actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/merchant/products')}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-7 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-md shadow-brand-600/20 transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Save Changes' : 'Post Item to Store'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Marketplace Preview Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 sticky top-24">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100 text-gray-700">
            <Eye className="w-4 h-4 text-brand-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider">Live Customer Card Preview</h2>
          </div>

          <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-xs">
            {/* Image Preview */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name || 'Item preview'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback on broken image
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              ) : (
                <div className="text-center p-4 text-gray-400">
                  <ImageIcon className="w-10 h-10 mx-auto opacity-50 mb-1" />
                  <span className="text-[11px]">Upload an image to preview</span>
                </div>
              )}
              {parseInt(stock || '0', 10) <= 5 && parseInt(stock || '0', 10) > 0 && (
                <span className="absolute top-2.5 left-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Only {stock} left
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                {selectedCategoryObj?.name || 'Category'}
              </span>

              <h3 className="font-bold text-sm text-gray-900 line-clamp-1">
                {name || 'Your Item Title'}
              </h3>

              <p className="text-xs text-gray-500 line-clamp-2">
                {description || 'Product description will appear here on customer pages.'}
              </p>

              <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Price</span>
                  <span className="text-base font-extrabold text-gray-900">
                    ${price ? parseFloat(price).toFixed(2) : '0.00'}
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {isActive ? 'Active' : 'Draft / Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-brand-50/70 p-3 rounded-2xl border border-brand-100 text-[11px] text-brand-800 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <p>
              Once published, this item will immediately appear in your store catalog and the main marketplace search.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
