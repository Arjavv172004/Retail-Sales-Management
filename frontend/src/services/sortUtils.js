/**
 * Sort transactions by the specified field and order
 */
export const sortTransactions = (transactions, sortBy, sortOrder = 'asc') => {
  if (!sortBy) return transactions;
  
  const sorted = [...transactions];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        comparison = dateB - dateA;
        break;
      
      case 'quantity':
        comparison = (a.quantity || 0) - (b.quantity || 0);
        break;
      
      case 'customerName':
        const nameA = (a.customerName || '').toLowerCase();
        const nameB = (b.customerName || '').toLowerCase();
        comparison = nameA.localeCompare(nameB);
        break;
      
      default:
        return 0;
    }
    
    if (sortOrder === 'desc' && sortBy !== 'date') {
      return -comparison;
    }
    if (sortOrder === 'asc' && sortBy === 'date') {
      return -comparison;
    }
    
    return comparison;
  });
  
  return sorted;
};
