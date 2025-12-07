import { useState, useEffect, useMemo } from 'react';
import { loadCSV, transformTransaction, extractFilterOptions } from '../services/csvLoader';
import { applyFilters } from '../services/filterUtils';
import { sortTransactions } from '../services/sortUtils';
import { CSV_CONFIG } from '../config';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import FilterRow from '../components/FilterRow';
import SummaryCards from '../components/SummaryCards';
import TransactionTable from '../components/TransactionTable';
import SortDropdown from '../components/SortDropdown';
import Pagination from '../components/Pagination';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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
  const ITEMS_PER_PAGE = 10;

  // Load CSV data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('📂 Loading CSV from:', CSV_CONFIG.url);
        
        // Load CSV from URL
        const rawData = await loadCSV(CSV_CONFIG.url);
        
        // Transform data
        const transactions = rawData.map(transformTransaction);
        
        // Store in state
        setAllTransactions(transactions);
        
        // Extract filter options
        const options = extractFilterOptions(transactions);
        setFilterOptions(options);
        
        console.log(`✅ Loaded ${transactions.length.toLocaleString()} transactions`);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  // Process data: filter, sort, paginate
  const processedData = useMemo(() => {
    if (!allTransactions.length) {
      return { 
        data: [], 
        pagination: { 
          currentPage: 1, 
          totalPages: 0, 
          totalRecords: 0, 
          limit: ITEMS_PER_PAGE 
        } 
      };
    }

    // Apply filters
    const filtered = allTransactions.filter(transaction => 
      applyFilters(transaction, { ...filters, search: debouncedSearch })
    );

    // Apply sorting
    const sorted = sortTransactions(filtered, sort.field, sort.order);

    // Calculate pagination
    const totalRecords = sorted.length;
    const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginated = sorted.slice(startIndex, endIndex);

    return {
      data: paginated,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit: ITEMS_PER_PAGE,
      },
    };
  }, [allTransactions, filters, debouncedSearch, sort, page]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Sales Management System</h1>
            <div className="flex items-center space-x-4">
              <SearchBar value={search} onChange={setSearch} />
              <SortDropdown value={sort} onChange={handleSort} />
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-4">
              <p className="font-semibold">Error loading data</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-xs mt-2 text-red-600">
                Please check the CSV_URL in frontend/src/config.js
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading CSV data...</span>
            </div>
          )}

          {!error && !isLoading && (
            <>
              <FilterRow
                filterOptions={filterOptions}
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              <SummaryCards data={{ data: processedData.data }} />

              <TransactionTable
                transactions={processedData.data}
                onSort={handleSort}
                currentSort={sort}
              />

              {processedData.pagination.totalPages > 1 && (
                <Pagination
                  currentPage={processedData.pagination.currentPage}
                  totalPages={processedData.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}

              <div className="mt-6 text-center text-sm text-gray-500">
                Showing {processedData.data.length} of {processedData.pagination.totalRecords.toLocaleString()} transactions
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
