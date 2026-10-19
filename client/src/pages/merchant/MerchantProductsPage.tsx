import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Package, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { apiRequest } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export const MerchantProductsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    if (!user?.merchantId) return;
    try {
      const data = await apiRequest<{ products: Product[] }>(`/products?merchantId=${user.merchantId}`);
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Store Products</h1>
          <p className="text-xs text-gray-500 mt-1">
            Add new inventory, adjust pricing, and toggle active status
          </p>
        </div>

        <Link
          to="/merchant/products/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search products in catalog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
        />
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs text-gray-500 font-medium">No products found in your inventory.</p>
            <Link
              to="/merchant/products/new"
              className="inline-block text-xs font-bold text-brand-600 hover:underline"
            >
              Add your first product now →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <span className="font-bold text-gray-900 block truncate">{product.name}</span>
                        <span className="text-[11px] text-gray-400 truncate block">{product.description}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-gray-900">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`font-semibold ${product.stock <= 5 ? 'text-amber-600' : 'text-gray-700'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        product.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <Link
                          to={`/merchant/products/${product.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded-lg transition"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
