import Papa from 'papaparse';

export const loadCSV = async (url) => {
  try {
    console.log('📂 Starting CSV download from:', url);
    const startTime = Date.now();
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'text/csv,application/csv,text/plain',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText}`);
    }
    
    const csvText = await response.text();
    
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('CSV file is empty');
    }
    
    const downloadTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Downloaded in ${downloadTime}s, parsing...`);
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('⚠️ Parsing warnings:', results.errors.slice(0, 3));
          }
          
          if (!results.data || results.data.length === 0) {
            reject(new Error('No data found in CSV file'));
            return;
          }
          
          console.log(`✅ Parsed ${results.data.length.toLocaleString()} rows`);
          resolve(results.data);
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        }
      });
    });
  } catch (error) {
    console.error('❌ Error loading CSV:', error);
    
    // Provide specific error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('CORS Error: The CSV file cannot be accessed due to CORS policy. Please enable CORS on your Cloudflare R2 bucket or use a different hosting solution.');
    } else if (error.message.includes('NetworkError')) {
      throw new Error('Network Error: Unable to reach the CSV file. Please check your internet connection and the URL.');
    } else {
      throw error;
    }
  }
};

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
