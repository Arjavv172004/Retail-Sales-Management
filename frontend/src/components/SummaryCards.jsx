import { Info } from 'lucide-react';

const SummaryCards = ({ data }) => {
  // Calculate summary from transactions
  const totalUnits = data?.data?.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0;
  const totalAmount = data?.data?.reduce((sum, t) => sum + (t.finalAmount || 0), 0) || 0;
  const totalDiscount = data?.data?.reduce((sum, t) => sum + ((t.totalAmount || 0) - (t.finalAmount || 0)), 0) || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total units sold</p>
            <p className="text-2xl font-semibold text-gray-900">{totalUnits}</p>
          </div>
          <Info className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <Info className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Discount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(totalDiscount)}
            </p>
          </div>
          <Info className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;

