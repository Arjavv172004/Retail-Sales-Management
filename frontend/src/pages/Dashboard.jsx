import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTransactions, useFilterOptions } from '../hooks/useTransactions';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect shadow-lg border-b border-white/30 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold gradient-text mb-2">Retail Sales Management</h1>
              <p className="text-gray-600 font-medium">Manage and analyze your sales transactions with precision</p>
            </motion.div>
            {data?.pagination && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-right bg-gradient-to-br from-primary-500 to-accent-500 text-white px-6 py-4 rounded-2xl shadow-lg"
              >
                <div className="text-3xl font-bold mb-1">
                  {data.pagination.totalRecords.toLocaleString()}
                </div>
                <div className="text-sm font-medium opacity-90">Total Records</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel - Left Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Sort Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <SearchBar
                value={search}
                onChange={setSearch}
              />
              <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-soft">
                <SortDropdown
                  value={sort}
                  onChange={handleSort}
                />
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 text-primary-600 font-medium"
                  >
                    <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                    <span className="text-sm">Loading transactions...</span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-red-50 border-2 border-red-300 text-red-800 p-6"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-2">Error loading transactions</p>
                    <p className="text-sm mb-3">{error.message || 'An unexpected error occurred'}</p>
                    <div className="bg-red-100 p-3 rounded text-xs">
                      <p className="font-semibold mb-1">Troubleshooting steps:</p>
                      <ul className="list-disc list-inside space-y-1 text-red-700">
                        <li>Ensure the backend server is running on port 5000</li>
                        <li>Check that the CSV file exists in the project root</li>
                        <li>Verify CORS is enabled in the backend</li>
                        <li>Check the browser console for more details</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Transaction Table */}
            {!error && (
              <TransactionTable
                transactions={data?.data || []}
                onSort={handleSort}
                currentSort={sort}
              />
            )}

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Results Info */}
            {data?.pagination && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-soft"
              >
                <span className="font-semibold text-primary-700">
                  Showing {((data.pagination.currentPage - 1) * data.pagination.limit) + 1} to{' '}
                  {Math.min(data.pagination.currentPage * data.pagination.limit, data.pagination.totalRecords)} of{' '}
                  {data.pagination.totalRecords.toLocaleString()}
                </span>
                <span className="text-gray-500"> results</span>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

