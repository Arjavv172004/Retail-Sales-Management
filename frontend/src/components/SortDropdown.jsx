import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';

const SortDropdown = ({ value, onChange }) => {
  const sortOptions = [
    { value: 'date:desc', label: 'Date (Newest First)' },
    { value: 'date:asc', label: 'Date (Oldest First)' },
    { value: 'quantity:asc', label: 'Quantity (Low to High)' },
    { value: 'quantity:desc', label: 'Quantity (High to Low)' },
    { value: 'customerName:asc', label: 'Customer Name (A-Z)' },
    { value: 'customerName:desc', label: 'Customer Name (Z-A)' },
  ];

  const handleChange = (e) => {
    const [field, order] = e.target.value.split(':');
    onChange(field, order);
  };

  const currentValue = value ? `${value.field}:${value.order}` : 'date:desc';

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <select
        value={currentValue}
        onChange={handleChange}
        className="select-field min-w-[200px] text-sm border border-gray-300 rounded px-3 py-2"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;

