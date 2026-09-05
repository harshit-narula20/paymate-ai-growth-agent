import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Search,
  Filter,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getTransactions({
        page,
        limit: 25,
        ...(paymentStatus ? { paymentStatus } : {})
      });
      setTransactions(res.data || []);
      setPagination(res.pagination || { total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err.message || 'Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, paymentStatus]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-indigo-400" /> Transaction Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of 1,050+ store orders, gateway checkouts, and payment statuses
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { key: '', label: 'All Transactions' },
          { key: 'completed', label: 'Completed Orders' },
          { key: 'failed', label: 'Failed Checkouts' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setPaymentStatus(t.key);
              setPage(1);
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              paymentStatus === t.key
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      {loading ? (
        <LoadingState message="Loading transactions ledger..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTransactions} />
      ) : (
        <Card className="overflow-hidden p-0 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-500 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items / Category</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      #{tx._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-100 block">
                        {tx.customerId?.name || 'Customer'}
                      </span>
                      <span className="text-[11px] text-slate-500">{tx.customerId?.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      {tx.products?.map(p => p.name).join(', ') || 'Apex Footwear'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{tx.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono uppercase text-slate-300 text-[11px]">
                      {tx.paymentMethod || 'card'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={tx.paymentStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(tx.transactionDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-slate-800 text-xs text-slate-400">
            <span>Showing {transactions.length} of {pagination.total} transactions</span>
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
