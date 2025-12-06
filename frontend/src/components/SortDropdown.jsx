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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-3"
    >
      <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg shadow-md"
      >
        <ArrowUpDown className="w-5 h-5 text-white" />
      </motion.div>
      <select
        value={currentValue}
        onChange={handleChange}
        className="select-field min-w-[220px] font-semibold text-gray-700 hover:border-primary-400 focus:shadow-glow"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default SortDropdown;

