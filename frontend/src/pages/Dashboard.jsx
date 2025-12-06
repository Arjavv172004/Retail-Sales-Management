import { useState, useEffect, useMemo } from 'react';
import { useTransactions, useFilterOptions } from '../hooks/useTransactions';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import FilterRow from '../components/FilterRow';
import SummaryCards from '../components/SummaryCards';
import TransactionTable from '../components/TransactionTable';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    ageMin: undefined,
    ageMax: undefined,
    categories: [],
    tags: [],
    paymentMethods: [],
    dateFrom: undefined,
    dateTo: undefined,
  });
  const [sort, setSort] = useState({ field: 'date', order: 'desc' });
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data: filterOptions, isLoading: loadingOptions } = useFilterOptions();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const queryParams = useMemo(() => ({
    search: debouncedSearch,
    ...filters,
    sortBy: sort.field,
    sortOrder: sort.order,
  }), [debouncedSearch, filters, sort]);

  const { data, isLoading, error } = useTransactions(queryParams, page, 10);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      regions: [],
      genders: [],
      ageMin: undefined,
      ageMax: undefined,
      categories: [],
      tags: [],
      paymentMethods: [],
      dateFrom: undefined,
      dateTo: undefined,
    });
    setSearch('');
    setPage(1);
  };

  const handleSort = (field, order) => {
    setSort({ field, order });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Sales Management System</h1>
            <div className="flex items-center space-x-4">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Name, Phone no."
              />
              <SortDropdown
                value={sort}
                onChange={handleSort}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 py-6">
          {/* Filter Row */}
          <FilterRow
            filterOptions={filterOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Summary Cards */}
          <SummaryCards data={data} />

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-4">
              <p className="font-semibold">Error loading transactions</p>
              <p className="text-sm mt-1">{error.message || 'An unexpected error occurred'}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading...</span>
            </div>
          )}

          {/* Transaction Table */}
          {!error && !isLoading && (
            <TransactionTable
              transactions={data?.data || []}
              onSort={handleSort}
              currentSort={sort}
            />
          )}

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

