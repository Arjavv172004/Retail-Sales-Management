import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const TransactionTable = ({ transactions, onSort, currentSort }) => {

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
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return currentSort.order === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-gray-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-gray-600" />
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
      <div className="bg-white border border-gray-200 rounded p-12 text-center">
        <p className="text-gray-600 text-lg">No transactions found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-gray-900"
                >
                  <span>Date</span>
                  {getSortIcon('date')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Age
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Product Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('quantity')}
                  className="flex items-center space-x-1 hover:text-gray-900"
                >
                  <span>Quantity</span>
                  {getSortIcon('quantity')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.transactionId || index}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {transaction.transactionId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {transaction.customerId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {transaction.customerName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    <span>{transaction.phoneNumber}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {transaction.gender}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {transaction.age}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {transaction.productCategory}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {String(transaction.quantity).padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;

