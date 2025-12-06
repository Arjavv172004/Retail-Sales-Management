import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FilterPanel = ({ filters, filterOptions, onFilterChange, onReset }) => {
  const [expandedSections, setExpandedSections] = useState({
    region: true,
    gender: true,
    age: true,
    category: true,
    tags: true,
    payment: true,
    date: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMultiSelect = (filterKey, value) => {
    const current = filters[filterKey] || [];
    const newValue = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onFilterChange({ [filterKey]: newValue });
  };

  const handleRangeChange = (filterKey, value, isMin = true) => {
    const rangeKey = isMin ? `${filterKey}Min` : `${filterKey}Max`;
    onFilterChange({ [rangeKey]: value ? parseInt(value) : undefined });
  };

  const handleDateChange = (filterKey, value) => {
    onFilterChange({ [filterKey]: value || undefined });
  };

  const hasActiveFilters = () => {
    return (
      (filters.regions?.length > 0) ||
      (filters.genders?.length > 0) ||
      filters.ageMin ||
      filters.ageMax ||
      (filters.categories?.length > 0) ||
      (filters.tags?.length > 0) ||
      (filters.paymentMethods?.length > 0) ||
      filters.dateFrom ||
      filters.dateTo
    );
  };

  const FilterSection = ({ title, sectionKey, children }) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-b border-gray-200/50 last:border-b-0 bg-white/40 rounded-lg mb-2 overflow-hidden"
      >
        <motion.button
          onClick={() => toggleSection(sectionKey)}
          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
          className="w-full flex items-center justify-between p-4 transition-all duration-200"
        >
          <span className="font-semibold text-gray-800">{title}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-primary-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </motion.div>
        </motion.button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-2">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const CheckboxOption = ({ label, value, checked, onChange }) => (
    <motion.label
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        checked 
          ? 'bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200' 
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-5 h-5 text-primary-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer accent-primary-600"
        />
      </div>
      <span className={`text-sm font-medium ${checked ? 'text-primary-800' : 'text-gray-700'}`}>
        {label}
      </span>
    </motion.label>
  );

  if (!filterOptions) {
    return (
      <div className="card">
        <div className="animate-pulse">Loading filters...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="card-gradient sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg shadow-md"
          >
            <Filter className="w-5 h-5 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold gradient-text">Filters</h2>
        </div>
        {hasActiveFilters() && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition-colors border border-red-200"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>

      <div className="space-y-1">
        {/* Region Filter */}
        <FilterSection title="Customer Region" sectionKey="region">
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filterOptions.regions?.map(region => (
              <CheckboxOption
                key={region}
                label={region}
                value={region}
                checked={filters.regions?.includes(region) || false}
                onChange={() => handleMultiSelect('regions', region)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Gender Filter */}
        <FilterSection title="Gender" sectionKey="gender">
          <div className="space-y-1">
            {filterOptions.genders?.map(gender => (
              <CheckboxOption
                key={gender}
                label={gender}
                value={gender}
                checked={filters.genders?.includes(gender) || false}
                onChange={() => handleMultiSelect('genders', gender)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Age Range Filter */}
        <FilterSection title="Age Range" sectionKey="age">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Age</label>
              <input
                type="number"
                min={filterOptions.ageRange?.min || 0}
                max={filterOptions.ageRange?.max || 100}
                value={filters.ageMin || ''}
                onChange={(e) => handleRangeChange('age', e.target.value, true)}
                placeholder="Min"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Age</label>
              <input
                type="number"
                min={filterOptions.ageRange?.min || 0}
                max={filterOptions.ageRange?.max || 100}
                value={filters.ageMax || ''}
                onChange={(e) => handleRangeChange('age', e.target.value, false)}
                placeholder="Max"
                className="input-field"
              />
            </div>
          </div>
        </FilterSection>

        {/* Product Category Filter */}
        <FilterSection title="Product Category" sectionKey="category">
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filterOptions.categories?.map(category => (
              <CheckboxOption
                key={category}
                label={category}
                value={category}
                checked={filters.categories?.includes(category) || false}
                onChange={() => handleMultiSelect('categories', category)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Tags Filter */}
        <FilterSection title="Tags" sectionKey="tags">
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filterOptions.tags?.map(tag => (
              <CheckboxOption
                key={tag}
                label={tag}
                value={tag}
                checked={filters.tags?.includes(tag) || false}
                onChange={() => handleMultiSelect('tags', tag)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Payment Method Filter */}
        <FilterSection title="Payment Method" sectionKey="payment">
          <div className="space-y-1">
            {filterOptions.paymentMethods?.map(method => (
              <CheckboxOption
                key={method}
                label={method}
                value={method}
                checked={filters.paymentMethods?.includes(method) || false}
                onChange={() => handleMultiSelect('paymentMethods', method)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Date Range Filter */}
        <FilterSection title="Date Range" sectionKey="date">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                min={filterOptions.dateRange?.min}
                max={filterOptions.dateRange?.max}
                value={filters.dateFrom || ''}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                min={filterOptions.dateRange?.min}
                max={filterOptions.dateRange?.max}
                value={filters.dateTo || ''}
                onChange={(e) => handleDateChange('dateTo', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </FilterSection>
      </div>
    </motion.div>
  );
};

export default FilterPanel;

