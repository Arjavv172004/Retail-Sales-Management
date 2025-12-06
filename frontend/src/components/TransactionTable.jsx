import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

const TransactionTable = ({ transactions, onSort, currentSort }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSortIcon = (field) => {
    if (currentSort?.field !== field) {
      return <ArrowUpDown className="w-4 h-4 text-white/70" />;
    }
    return currentSort.order === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-white" />
    ) : (
      <ArrowDown className="w-4 h-4 text-white" />
    );
  };

  const handleSort = (field) => {
    const newOrder = currentSort?.field === field && currentSort?.order === 'asc' 
      ? 'desc' 
      : 'asc';
    onSort(field, newOrder);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-gradient text-center py-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          📊
        </motion.div>
        <p className="text-gray-700 text-xl font-semibold mb-2">No transactions found</p>
        <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card overflow-hidden p-0 shadow-lg"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  <motion.button
                  onClick={() => handleSort('date')}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 hover:text-white transition-colors text-white"
                >
                  <span>Date</span>
                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                    {getSortIcon('date')}
                  </motion.div>
                </motion.button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  <motion.button
                  onClick={() => handleSort('quantity')}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 hover:text-white transition-colors text-white"
                >
                  <span>Quantity</span>
                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                    {getSortIcon('quantity')}
                  </motion.div>
                </motion.button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <AnimatePresence>
              {transactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.transactionId || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  onMouseEnter={() => setHoveredRow(transaction.transactionId)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`transition-all duration-200 ${
                    hoveredRow === transaction.transactionId
                      ? 'bg-gradient-to-r from-primary-50 to-accent-50 shadow-md scale-[1.01]'
                      : 'hover:bg-gray-50/50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{transaction.customerName}</div>
                      <div className="text-gray-500 text-xs">{transaction.phoneNumber}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {transaction.customerRegion} • {transaction.gender}, {transaction.age}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{transaction.productName}</div>
                      <div className="text-gray-500 text-xs">{transaction.brand}</div>
                      <div className="text-gray-400 text-xs mt-1">{transaction.productCategory}</div>
                      {transaction.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {transaction.tags.split(',').slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="badge bg-primary-100 text-primary-800"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(transaction.finalAmount)}
                      </div>
                      {transaction.discountPercentage > 0 && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatCurrency(transaction.totalAmount)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={`badge ${
                        transaction.orderStatus === 'Completed'
                          ? 'badge-success'
                          : transaction.orderStatus === 'Cancelled'
                          ? 'badge-error'
                          : transaction.orderStatus === 'Returned'
                          ? 'badge-warning'
                          : 'badge-info'
                      }`}
                    >
                      {transaction.orderStatus}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TransactionTable;

