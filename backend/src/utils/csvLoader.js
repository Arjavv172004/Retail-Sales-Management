import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let transactionsCache = null;
let loadPromise = null;

/**
 * Load and parse CSV file into memory
 * Uses caching to avoid reloading on every request
 */
export const loadTransactions = () => {
  if (transactionsCache) {
    return Promise.resolve(transactionsCache);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const transactions = [];
    const csvPath = path.join(__dirname, '../../../truestate_assignment_dataset.csv');

    console.log(`🔍 Looking for CSV at: ${csvPath}`);
    
    if (!fs.existsSync(csvPath)) {
      const errorMsg = `CSV file not found at ${csvPath}. Please ensure truestate_assignment_dataset.csv is in the project root.`;
      console.error(`❌ ${errorMsg}`);
      reject(new Error(errorMsg));
      return;
    }

    console.log('📂 Loading CSV file...');
    const startTime = Date.now();

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // Parse numeric fields
        const transaction = {
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
        };
        transactions.push(transaction);
      })
      .on('end', () => {
        transactionsCache = transactions;
        const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ Loaded ${transactions.length.toLocaleString()} transactions in ${loadTime}s`);
        resolve(transactions);
      })
      .on('error', (error) => {
        console.error('❌ Error loading CSV:', error);
        reject(error);
      });
  });

  return loadPromise;
};

/**
 * Clear cache (useful for testing or reloading data)
 */
export const clearCache = () => {
  transactionsCache = null;
  loadPromise = null;
};

