import React from 'react';
import { Filter, X, ArrowUpDown } from 'lucide-react';
import { SERVICE_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';

export const FilterPanel = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-subtle mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters & Sort</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium transition self-start md:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
          >
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Budget (INR)
          </label>
          <select
            value={priceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
          >
            <option value="">Any Price</option>
            <option value="under_1000">Under ₹1,000</option>
            <option value="1000_2000">₹1,000 – ₹2,000</option>
            <option value="above_2000">Above ₹2,000</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
