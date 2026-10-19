import React, { useEffect, useState } from 'react';
import { Store, CheckCircle, Ban, Search } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';
import { apiRequest } from '../../services/api';
import { MerchantStatus } from '../../types';

interface AdminMerchant {
  id: string;
  storeName: string;
  userEmail: string;
  userName: string;
  phone?: string;
  address?: string;
  status: MerchantStatus;
  productCount: number;
  orderCount: number;
}

export const AdminMerchantsPage: React.FC = () => {
  const [merchants, setMerchants] = useState<AdminMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<{ merchants: AdminMerchant[] }>('/admin/merchants');
      setMerchants(data.merchants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (merchantId: string, status: MerchantStatus) => {
    try {
      await apiRequest(`/admin/merchants/${merchantId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      loadMerchants();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const filtered = merchants.filter(m =>
    m.storeName.toLowerCase().includes(search.toLowerCase()) ||
    m.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manage Merchants</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review store applications, verify vendors, or suspend stores violating guidelines
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search stores or emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading merchant list...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">No merchants found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Store Details</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900 block">{m.storeName}</span>
                      <span className="text-[10px] text-gray-400">{m.address || 'Online only'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-800 block">{m.userName}</span>
                      <span className="text-[10px] text-gray-400">{m.userEmail}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-700">
                      {m.productCount} items
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-700">
                      {m.orderCount} orders
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-2">
                        {m.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'APPROVED')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-[11px] transition"
                          >
                            Approve
                          </button>
                        )}
                        {m.status !== 'SUSPENDED' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'SUSPENDED')}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold text-[11px] transition"
                          >
                            Suspend
                          </button>
                        )}
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
