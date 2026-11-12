import React, { useState, useEffect, useMemo } from 'react';
import { Layers, RotateCcw } from 'lucide-react';
import { servicePackageService } from '../services/servicePackageService';
import { ServiceCard } from '../components/cards/ServiceCard';
import { SearchBar } from '../components/common/SearchBar';
import { FilterPanel } from '../components/common/FilterPanel';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { useDebounce } from '../hooks/useDebounce';

export const ServiceListing = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const debouncedSearch = useDebounce(searchQuery, 250);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await servicePackageService.getAll();
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('Unable to load service packages. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, priceRange, sortBy]);

  // Client-side filtering & sorting for smooth UX
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search query
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q)) ||
          (s.category && s.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Price range filter
    if (priceRange === 'under_1000') {
      result = result.filter((s) => s.price < 1000);
    } else if (priceRange === '1000_2000') {
      result = result.filter((s) => s.price >= 1000 && s.price <= 2000);
    } else if (priceRange === 'above_2000') {
      result = result.filter((s) => s.price > 2000);
    }

    // Sort order
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'duration_asc') {
      result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    } else {
      // Popularity & Rating
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating);
    }

    return result;
  }, [services, debouncedSearch, selectedCategory, priceRange, sortBy]);

  // Paginated items
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredServices.slice(startIndex, startIndex + pageSize);
  }, [filteredServices, currentPage, pageSize]);

  const hasActiveFilters = Boolean(
    debouncedSearch || selectedCategory || priceRange || sortBy !== 'popularity'
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange('');
    setSortBy('popularity');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Delhi NCR Workshop Menu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Two-Wheeler Service Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified maintenance for scooters, commuter bikes, cruisers and electric two-wheelers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search packages, e.g. 'oil', 'brake'..."
          />
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content State Handling */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchServices} />
      ) : paginatedServices.length === 0 ? (
        <EmptyState
          title="No service packages match your criteria"
          description="Try relaxing your search terms or clearing price and category filters to browse all packages."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredServices.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};
