/**
 * Utility functions for filtering transactions
 */

/**
 * Check if a value matches search criteria (case-insensitive)
 */
export const matchesSearch = (transaction, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return true;
  }

  const search = searchTerm.toLowerCase().trim();
  const customerName = (transaction.customerName || '').toLowerCase();
  const phoneNumber = (transaction.phoneNumber || '').toLowerCase();

  return customerName.includes(search) || phoneNumber.includes(search);
};

/**
 * Check if transaction matches region filter
 */
export const matchesRegion = (transaction, regions) => {
  if (!regions || regions.length === 0) {
    return true;
  }
  return regions.includes(transaction.customerRegion);
};

/**
 * Check if transaction matches gender filter
 */
export const matchesGender = (transaction, genders) => {
  if (!genders || genders.length === 0) {
    return true;
  }
  return genders.includes(transaction.gender);
};

/**
 * Check if transaction matches age range filter
 */
export const matchesAgeRange = (transaction, ageMin, ageMax) => {
  const age = transaction.age || 0;
  if (ageMin !== undefined && ageMin !== null && age < ageMin) {
    return false;
  }
  if (ageMax !== undefined && ageMax !== null && age > ageMax) {
    return false;
  }
  return true;
};

/**
 * Check if transaction matches product category filter
 */
export const matchesCategory = (transaction, categories) => {
  if (!categories || categories.length === 0) {
    return true;
  }
  return categories.includes(transaction.productCategory);
};

/**
 * Check if transaction matches tags filter
 */
export const matchesTags = (transaction, filterTags) => {
  if (!filterTags || filterTags.length === 0) {
    return true;
  }

  const transactionTags = (transaction.tags || '')
    .toLowerCase()
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  return filterTags.some(tag => 
    transactionTags.includes(tag.toLowerCase().trim())
  );
};

/**
 * Check if transaction matches payment method filter
 */
export const matchesPaymentMethod = (transaction, paymentMethods) => {
  if (!paymentMethods || paymentMethods.length === 0) {
    return true;
  }
  return paymentMethods.includes(transaction.paymentMethod);
};

/**
 * Check if transaction matches date range filter
 */
export const matchesDateRange = (transaction, dateFrom, dateTo) => {
  if (!dateFrom && !dateTo) {
    return true;
  }

  const transactionDate = new Date(transaction.date);
  if (isNaN(transactionDate.getTime())) {
    return false;
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    if (transactionDate < fromDate) {
      return false;
    }
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999); // Include entire end date
    if (transactionDate > toDate) {
      return false;
    }
  }

  return true;
};

/**
 * Apply all filters to a transaction
 */
export const applyFilters = (transaction, filters) => {
  if (!matchesSearch(transaction, filters.search)) {
    return false;
  }
  if (!matchesRegion(transaction, filters.regions)) {
    return false;
  }
  if (!matchesGender(transaction, filters.genders)) {
    return false;
  }
  if (!matchesAgeRange(transaction, filters.ageMin, filters.ageMax)) {
    return false;
  }
  if (!matchesCategory(transaction, filters.categories)) {
    return false;
  }
  if (!matchesTags(transaction, filters.tags)) {
    return false;
  }
  if (!matchesPaymentMethod(transaction, filters.paymentMethods)) {
    return false;
  }
  if (!matchesDateRange(transaction, filters.dateFrom, filters.dateTo)) {
    return false;
  }

  return true;
};

