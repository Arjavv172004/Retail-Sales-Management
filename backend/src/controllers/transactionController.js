import { getTransactions, getFilterOptions } from '../services/transactionService.js';

/**
 * Get paginated transactions with filters, search, and sorting
 */
export const getTransactionsHandler = async (req, res) => {
  try {
    const result = await getTransactions(req.query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

/**
 * Get available filter options
 */
export const getFilterOptionsHandler = async (req, res) => {
  try {
    const options = await getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

