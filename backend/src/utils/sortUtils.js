/**
 * Utility functions for sorting transactions
 */

/**
 * Sort transactions by the specified field and order
 */
export const sortTransactions = (transactions, sortBy, sortOrder = 'asc') => {
  if (!sortBy) {
    return transactions;
  }

  const sorted = [...transactions];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        comparison = dateB - dateA; // Newest first by default
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

    // Apply sort order
    if (sortOrder === 'desc' && sortBy !== 'date') {
      return -comparison;
    }
    if (sortOrder === 'asc' && sortBy === 'date') {
      return -comparison; // For date, 'asc' means oldest first (reverse of default)
    }

    return comparison;
  });

  return sorted;
};

