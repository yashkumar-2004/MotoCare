import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search by package, symptom, or vehicle model...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md transition"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
