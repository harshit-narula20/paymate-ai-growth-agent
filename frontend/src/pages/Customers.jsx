import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Eye,
  ArrowUpDown,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

export function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');
  const [churnRisk, setChurnRisk] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 25,
        ...(search ? { search } : {}),
        ...(segment ? { segment } : {}),
        ...(churnRisk ? { churnRisk } : {}),
      };
      const res = await api.getCustomers(params);
      setCustomers(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError(err.message || 'Error fetching customer directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, segment, churnRisk]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const getChurnBadge = (risk) => {
    switch (risk) {
      case 'high': return <Badge variant="danger" size="sm">High Churn Risk</Badge>;
      case 'medium': return <Badge variant="warning" size="sm">Medium</Badge>;
      default: return <Badge variant="success" size="sm">Low Risk</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Customer Intelligence CRM
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore 220+ seeded customer profiles, behavioral segments, LTV, and churn signals
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </form>

        <select
          value={segment}
          onChange={(e) => {
            setSegment(e.target.value);
            setPage(1);
          }}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">All Segments</option>
          <option value="shoe_buyer">Shoe Buyers (Cross-Sell Target)</option>
          <option value="inactive">Inactive (Win-Back Target)</option>
          <option value="high_ltv">High-LTV VIPs</option>
          <option value="loyal">Loyal Repeat Shoppers</option>
          <option value="failed_payment">Failed Payment Abandoners</option>
          <option value="new">New Customers</option>
        </select>

        <select
          value={churnRisk}
          onChange={(e) => {
            setChurnRisk(e.target.value);
            setPage(1);
          }}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">All Churn Levels</option>
          <option value="high">High Churn Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
      </div>

      {/* Customer Table */}
      {loading ? (
        <LoadingState message="Loading customers..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCustomers} />
      ) : customers.length === 0 ? (
        <EmptyState title="No matching customers" description="Try adjusting your search query or filters." />
      ) : (
        <Card className="overflow-hidden p-0 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-500 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Segment</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Orders</th>
                  <th className="py-3.5 px-4">AOV</th>
                  <th className="py-3.5 px-4">Last Purchase</th>
                  <th className="py-3.5 px-4">Churn Risk</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => navigate(`/customers/${c._id}`)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-100 block">{c.name}</span>
                      <span className="text-[11px] text-slate-500">{c.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary" size="sm">{c.segment?.replace('_', ' ')}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {c.purchaseCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      ₹{(c.averageOrderValue || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {c.lastPurchaseDate ? new Date(c.lastPurchaseDate).toLocaleDateString() : 'None'}
                    </td>
                    <td className="py-3.5 px-4">
                      {getChurnBadge(c.churnRisk)}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => navigate(`/customers/${c._id}`)}
                      >
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-slate-800 text-xs text-slate-400">
            <span>Showing {customers.length} of {pagination.total} customers</span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="px-2 font-medium text-slate-300">Page {page} of {pagination.pages || 1}</span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
