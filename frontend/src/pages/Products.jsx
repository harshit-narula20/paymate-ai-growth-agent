import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  DollarSign,
  Boxes,
  TrendingUp,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getProducts(selectedCategory ? { category: selectedCategory } : {});
      setProducts(res.data || []);
      setCategories(res.categories || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Error loading product catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" /> Catalog & Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store products analyzed by PayMate for cross-selling and bundle recommendations
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingState message="Loading product catalog..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : (
        <Card className="overflow-hidden p-0 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-500 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4">Sales Count</th>
                  <th className="py-3.5 px-4">Estimated GMV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-100 block">{prod.name}</span>
                      <span className="text-[11px] text-slate-500">{prod.description || 'Apex Sports Gear'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={prod.category === 'Accessories' ? 'purple' : 'default'} size="sm">
                        {prod.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${prod.inventory < 50 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {prod.inventory} in stock
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {prod.salesCount || Math.floor(Math.random() * 80 + 20)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{((prod.salesCount || 45) * prod.price).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
