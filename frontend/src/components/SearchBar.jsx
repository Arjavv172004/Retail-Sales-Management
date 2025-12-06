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
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="input-field pl-10 pr-10 w-64 border border-gray-300 rounded"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

