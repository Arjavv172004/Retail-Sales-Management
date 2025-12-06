import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const SearchBar = ({ value, onChange, placeholder = "Search by customer name or phone number..." }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="relative group">
        <motion.div
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 z-10"
          whileHover={{ scale: 1.1 }}
        >
          <Search className="w-5 h-5" />
        </motion.div>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="input-field pl-12 pr-12 w-full shadow-soft focus:shadow-glow focus:scale-[1.01] transition-all duration-300"
        />
        {localValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors bg-white rounded-full p-1 hover:bg-primary-50"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;

