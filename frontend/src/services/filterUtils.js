export const matchesSearch = (transaction, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return true;
  const search = searchTerm.toLowerCase().trim();
  const customerName = (transaction.customerName || '').toLowerCase();
  const phoneNumber = (transaction.phoneNumber || '').toLowerCase();
  return customerName.includes(search) || phoneNumber.includes(search);
};

export const applyFilters = (transaction, filters) => {
  if (!matchesSearch(transaction, filters.search)) return false;
  
  if (filters.regions?.length > 0 && !filters.regions.includes(transaction.customerRegion)) {
    return false;
  }
  
  if (filters.genders?.length > 0 && !filters.genders.includes(transaction.gender)) {
    return false;
  }
  
  const age = transaction.age || 0;
  if (filters.ageMin !== undefined && filters.ageMin !== null && age < filters.ageMin) {
    return false;
  }
  if (filters.ageMax !== undefined && filters.ageMax !== null && age > filters.ageMax) {
    return false;
  }
  
  if (filters.categories?.length > 0 && !filters.categories.includes(transaction.productCategory)) {
    return false;
  }
  
  if (filters.tags?.length > 0) {
    const transactionTags = (transaction.tags || '')
      .toLowerCase()
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    const hasMatchingTag = filters.tags.some(tag => 
      transactionTags.includes(tag.toLowerCase().trim())
    );
    if (!hasMatchingTag) return false;
  }
  
  if (filters.paymentMethods?.length > 0 && !filters.paymentMethods.includes(transaction.paymentMethod)) {
    return false;
  }
  
  if (filters.dateFrom || filters.dateTo) {
    const transactionDate = new Date(transaction.date);
    if (isNaN(transactionDate.getTime())) return false;
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (transactionDate < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (transactionDate > toDate) return false;
    }
  }
  
  return true;
};
