import { loadTransactions } from '../utils/csvLoader.js';
import { applyFilters } from '../utils/filterUtils.js';
import { sortTransactions } from '../utils/sortUtils.js';

/**
 * Parse filter parameters from query string
 */
const parseFilters = (query) => {
  return {
    search: query.search || '',
    regions: query.region ? query.region.split(',').filter(Boolean) : [],
    genders: query.gender ? query.gender.split(',').filter(Boolean) : [],
    ageMin: query.ageMin ? parseInt(query.ageMin) : undefined,
    ageMax: query.ageMax ? parseInt(query.ageMax) : undefined,
    categories: query.category ? query.category.split(',').filter(Boolean) : [],
    tags: query.tags ? query.tags.split(',').filter(Boolean) : [],
    paymentMethods: query.paymentMethod ? query.paymentMethod.split(',').filter(Boolean) : [],
    dateFrom: query.dateFrom || undefined,
    dateTo: query.dateTo || undefined,
  };
};

/**
 * Get unique values for filter options
 * Optimized for large datasets (1M+ records)
 */
export const getFilterOptions = async () => {
  const transactions = await loadTransactions();
  console.log('🔍 Processing filter options for', transactions.length.toLocaleString(), 'transactions...');

  // Use Sets for efficient unique value collection
  const regionsSet = new Set();
  const gendersSet = new Set();
  const categoriesSet = new Set();
  const paymentMethodsSet = new Set();
  const allTags = new Set();

  // Single pass through transactions to collect all unique values
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    
    if (t.customerRegion) regionsSet.add(t.customerRegion);
    if (t.gender) gendersSet.add(t.gender);
    if (t.productCategory) categoriesSet.add(t.productCategory);
    if (t.paymentMethod) paymentMethodsSet.add(t.paymentMethod);
    
    // Extract tags
    if (t.tags) {
      const tags = t.tags.split(',');
      for (let j = 0; j < tags.length; j++) {
        const trimmed = tags[j].trim();
        if (trimmed) allTags.add(trimmed);
      }
    }
  }

  // Convert to sorted arrays
  const regions = Array.from(regionsSet).sort();
  const genders = Array.from(gendersSet).sort();
  const categories = Array.from(categoriesSet).sort();
  const paymentMethods = Array.from(paymentMethodsSet).sort();
  const tags = Array.from(allTags).sort();

  // Get age range (optimized for large datasets)
  let ageMin = 100;
  let ageMax = 0;
  for (let i = 0; i < transactions.length; i++) {
    const age = transactions[i].age;
    if (age > 0) {
      if (age < ageMin) ageMin = age;
      if (age > ageMax) ageMax = age;
    }
  }
  if (ageMin === 100 && ageMax === 0) {
    ageMin = 0;
    ageMax = 100;
  }

  // Get date range (optimized for large datasets)
  let dateMin = null;
  let dateMax = null;
  let minTimestamp = Infinity;
  let maxTimestamp = -Infinity;
  
  for (let i = 0; i < transactions.length; i++) {
    const dateStr = transactions[i].date;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const timestamp = date.getTime();
        if (timestamp < minTimestamp) {
          minTimestamp = timestamp;
          dateMin = dateStr.split('T')[0]; // Get YYYY-MM-DD format
        }
        if (timestamp > maxTimestamp) {
          maxTimestamp = timestamp;
          dateMax = dateStr.split('T')[0]; // Get YYYY-MM-DD format
        }
      }
    }
  }

  const result = {
    regions,
    genders,
    categories,
    tags,
    paymentMethods,
    ageRange: { min: ageMin, max: ageMax },
    dateRange: { min: dateMin, max: dateMax },
  };

  console.log('✅ Filter options processed:', {
    regions: regions.length,
    genders: genders.length,
    categories: categories.length,
    tags: tags.length,
    paymentMethods: paymentMethods.length,
    ageRange: `${ageMin}-${ageMax}`,
    dateRange: `${dateMin || 'N/A'} to ${dateMax || 'N/A'}`,
  });

  return result;
};

/**
 * Get paginated transactions with filters, search, and sorting
 */
export const getTransactions = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const sortBy = query.sortBy || 'date';
  const sortOrder = query.sortOrder || 'desc';

  // Load all transactions
  const allTransactions = await loadTransactions();

  // Parse and apply filters
  const filters = parseFilters(query);
  const filtered = allTransactions.filter(transaction => 
    applyFilters(transaction, filters)
  );

  // Apply sorting
  const sorted = sortTransactions(filtered, sortBy, sortOrder);

  // Calculate pagination
  const totalRecords = sorted.length;
  const totalPages = Math.ceil(totalRecords / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = sorted.slice(startIndex, endIndex);

  return {
    data: paginated,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      limit,
    },
  };
};

