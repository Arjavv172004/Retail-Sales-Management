import Papa from 'papaparse';

/**
 * Loads and parses a CSV file from a URL
 * @param {string} url - The URL of the CSV file
 * @returns {Promise<Array>} Parsed CSV data as array of objects
 */
export const loadCSV = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
};

/**
 * Transform raw CSV row to transaction object
 */
export const transformTransaction = (row) => ({
  transactionId: row['Transaction ID'] || '',
  date: row['Date'] || '',
  customerId: row['Customer ID'] || '',
  customerName: row['Customer Name'] || '',
  phoneNumber: row['Phone Number'] || '',
  gender: row['Gender'] || '',
  age: parseInt(row['Age']) || 0,
  customerRegion: row['Customer Region'] || '',
  customerType: row['Customer Type'] || '',
  productId: row['Product ID'] || '',
  productName: row['Product Name'] || '',
  brand: row['Brand'] || '',
  productCategory: row['Product Category'] || '',
  tags: row['Tags'] || '',
  quantity: parseInt(row['Quantity']) || 0,
  pricePerUnit: parseFloat(row['Price per Unit']) || 0,
  discountPercentage: parseFloat(row['Discount Percentage']) || 0,
  totalAmount: parseFloat(row['Total Amount']) || 0,
  finalAmount: parseFloat(row['Final Amount']) || 0,
  paymentMethod: row['Payment Method'] || '',
  orderStatus: row['Order Status'] || '',
  deliveryType: row['Delivery Type'] || '',
  storeId: row['Store ID'] || '',
  storeLocation: row['Store Location'] || '',
  salespersonId: row['Salesperson ID'] || '',
  employeeName: row['Employee Name'] || '',
});

/**
 * Extract unique filter options from transactions
 */
export const extractFilterOptions = (transactions) => {
  const regions = new Set();
  const genders = new Set();
  const categories = new Set();
  const paymentMethods = new Set();
  const allTags = new Set();
  let ageMin = 100;
  let ageMax = 0;
  let dateMin = null;
  let dateMax = null;
  let minTimestamp = Infinity;
  let maxTimestamp = -Infinity;

  transactions.forEach(t => {
    if (t.customerRegion) regions.add(t.customerRegion);
    if (t.gender) genders.add(t.gender);
    if (t.productCategory) categories.add(t.productCategory);
    if (t.paymentMethod) paymentMethods.add(t.paymentMethod);
    
    if (t.tags) {
      t.tags.split(',').forEach(tag => {
        const trimmed = tag.trim();
        if (trimmed) allTags.add(trimmed);
      });
    }
    
    const age = t.age;
    if (age > 0) {
      if (age < ageMin) ageMin = age;
      if (age > ageMax) ageMax = age;
    }
    
    if (t.date) {
      const date = new Date(t.date);
      if (!isNaN(date.getTime())) {
        const timestamp = date.getTime();
        if (timestamp < minTimestamp) {
          minTimestamp = timestamp;
          dateMin = t.date.split('T')[0];
        }
        if (timestamp > maxTimestamp) {
          maxTimestamp = timestamp;
          dateMax = t.date.split('T')[0];
        }
      }
    }
  });

  if (ageMin === 100 && ageMax === 0) {
    ageMin = 0;
    ageMax = 100;
  }

  return {
    regions: Array.from(regions).sort(),
    genders: Array.from(genders).sort(),
    categories: Array.from(categories).sort(),
    tags: Array.from(allTags).sort(),
    paymentMethods: Array.from(paymentMethods).sort(),
    ageRange: { min: ageMin, max: ageMax },
    dateRange: { min: dateMin, max: dateMax },
  };
};
