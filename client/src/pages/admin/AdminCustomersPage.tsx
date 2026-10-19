import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, ShoppingBag } from 'lucide-react';
import { apiRequest } from '../../services/api';

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await apiRequest<{ customers: CustomerSummary[] }>('/admin/customers');
        setCustomers(data.customers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Registered Buyers</h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage and review registered marketplace customers and lifetime values
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading customer roster...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Orders Placed</th>
                  <th className="py-3.5 px-4">Lifetime Spent</th>
                  <th className="py-3.5 px-6">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">{c.name}</td>
                    <td className="py-4 px-4 text-gray-600">
                      <div>{c.email}</div>
                      {c.phone && <div className="text-[10px] text-gray-400">{c.phone}</div>}
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">{c.orderCount} orders</td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-600">${c.totalSpent.toFixed(2)}</td>
                    <td className="py-4 px-6 text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
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
