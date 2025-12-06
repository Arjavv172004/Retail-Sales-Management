import { X } from 'lucide-react';

const FilterRow = ({ filterOptions, filters, onFilterChange }) => {
  const handleFilterSelect = (filterType, value) => {
    if (!value) return;
    const current = filters[filterType] || [];
    // If already selected, remove it; otherwise add it
    if (current.includes(value)) {
      onFilterChange({ [filterType]: current.filter(item => item !== value) });
    } else {
      onFilterChange({ [filterType]: [...current, value] });
    }
  };

  const removeFilter = (filterType, value) => {
    const current = filters[filterType] || [];
    onFilterChange({ [filterType]: current.filter(item => item !== value) });
  };

  const clearAgeFilter = () => {
    onFilterChange({ ageMin: undefined, ageMax: undefined });
  };

  const clearDateFilter = () => {
    onFilterChange({ dateFrom: undefined, dateTo: undefined });
  };

  return (
    <div className="mb-6">
      {/* Filter Dropdowns */}
      <div className="flex items-center space-x-4 mb-4 overflow-x-auto pb-2">
        <select 
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[150px]"
          value=""
          onChange={(e) => {
            handleFilterSelect('regions', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Customer Region</option>
          {filterOptions?.regions?.filter(region => !filters.regions?.includes(region)).map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>

        <select 
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[120px]"
          value=""
          onChange={(e) => {
            handleFilterSelect('genders', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Gender</option>
          {filterOptions?.genders?.filter(gender => !filters.genders?.includes(gender)).map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>

        <select 
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[120px]"
          value=""
          onChange={(e) => {
            if (e.target.value) {
              const [min, max] = e.target.value.split('-');
              onFilterChange({ ageMin: parseInt(min), ageMax: parseInt(max) });
              e.target.value = '';
            }
          }}
        >
          <option value="">Age Range</option>
          {!filters.ageMin && !filters.ageMax && (
            <>
              <option value="0-18">0-18</option>
              <option value="19-25">19-25</option>
              <option value="26-35">26-35</option>
              <option value="36-50">36-50</option>
              <option value="51-100">51+</option>
            </>
          )}
        </select>

        <select 
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[150px]"
          value=""
          onChange={(e) => {
            handleFilterSelect('categories', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Product Category</option>
          {filterOptions?.categories?.filter(category => !filters.categories?.includes(category)).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select 
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[120px]"
          value=""
          onChange={(e) => {
            handleFilterSelect('tags', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Tags</option>
          {filterOptions?.tags?.filter(tag => !filters.tags?.includes(tag)).map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <select 
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white min-w-[150px]"
          value=""
          onChange={(e) => {
            handleFilterSelect('paymentMethods', e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">Payment Method</option>
          {filterOptions?.paymentMethods?.filter(method => !filters.paymentMethods?.includes(method)).map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>

        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          placeholder="Date"
          value={filters.dateFrom || ''}
          onChange={(e) => {
            if (e.target.value) {
              onFilterChange({ dateFrom: e.target.value, dateTo: e.target.value });
            } else {
              clearDateFilter();
            }
          }}
        />
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2">
        {/* Regions */}
        {filters.regions?.map(region => (
          <span key={region} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-300">
            Region: {region}
            <button
              onClick={() => removeFilter('regions', region)}
              className="ml-2 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Genders */}
        {filters.genders?.map(gender => (
          <span key={gender} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-300">
            Gender: {gender}
            <button
              onClick={() => removeFilter('genders', gender)}
              className="ml-2 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Age Range */}
        {(filters.ageMin !== undefined || filters.ageMax !== undefined) && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-300">
            Age: {filters.ageMin || 0}-{filters.ageMax || 100}
            <button
              onClick={clearAgeFilter}
              className="ml-2 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {/* Categories */}
        {filters.categories?.map(category => (
          <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-300">
            Category: {category}
            <button
              onClick={() => removeFilter('categories', category)}
              className="ml-2 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Tags */}
        {filters.tags?.map(tag => (
          <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-300">
            Tag: {tag}
            <button
              onClick={() => removeFilter('tags', tag)}
              className="ml-2 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Payment Methods */}
        {filters.paymentMethods?.map(method => (
          <span key={method} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-300">
            Payment: {method}
            <button
              onClick={() => removeFilter('paymentMethods', method)}
              className="ml-2 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Date */}
        {filters.dateFrom && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800 border border-gray-300">
            Date: {filters.dateFrom}
            <button
              onClick={clearDateFilter}
              className="ml-2 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterRow;

