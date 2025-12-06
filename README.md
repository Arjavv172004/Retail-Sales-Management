# TruEstate Retail Sales Management System

## Overview

A comprehensive Retail Sales Management System built to handle large-scale sales data with advanced search, filtering, sorting, and pagination capabilities. The system processes over 1 million transaction records efficiently while providing an intuitive and modern user interface with smooth animations and responsive design.

## Tech Stack

**Backend:**
- Node.js with Express.js
- CSV parsing with csv-parser for efficient data processing
- RESTful API architecture

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data fetching and caching
- Axios for API communication

## Search Implementation Summary

Full-text search is implemented across Customer Name and Phone Number fields. The search is case-insensitive and uses efficient string matching. The backend processes search queries by filtering records where either the customer name or phone number contains the search term (case-insensitive). Search works seamlessly in combination with filters, sorting, and pagination.

## Filter Implementation Summary

Multi-select filtering is implemented for Customer Region, Gender, Product Category, Tags, and Payment Method. Range-based filtering is provided for Age and Date Range. All filters work independently and can be combined. The backend processes multiple filter criteria simultaneously, applying AND logic between different filter types and OR logic within multi-select filters. Filter state is preserved during search, sorting, and pagination operations.

## Sorting Implementation Summary

Sorting is implemented for Date (newest first), Quantity (ascending/descending), and Customer Name (A-Z). The backend handles sorting at the database level after applying search and filter criteria. Sort direction can be toggled, and the sort state is maintained across pagination and other operations.

## Pagination Implementation Summary

Pagination is implemented with a fixed page size of 10 items per page. The backend calculates total pages based on filtered results and returns metadata including current page, total pages, and total records. Navigation includes Previous/Next buttons with proper state management. Pagination state is preserved when search, filters, or sorting change, automatically resetting to page 1.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm run install:all
   ```

2. **Ensure CSV File:**
   - Place `truestate_assignment_dataset.csv` in the project root directory

3. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

4. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

5. **Run Both (Development):**
   ```bash
   npm run dev
   ```

6. **Production Build:**
   ```bash
   cd backend && npm run build
   cd ../frontend && npm run build
   ```

## API Endpoints

- `GET /api/transactions` - Get paginated transactions with search, filters, sorting
  - Query params: `page`, `limit`, `search`, `region`, `gender`, `ageMin`, `ageMax`, `category`, `tags`, `paymentMethod`, `dateFrom`, `dateTo`, `sortBy`, `sortOrder`

## Notes

- The system is optimized to handle large datasets efficiently
- All edge cases are handled including empty results, invalid ranges, and missing fields
- The UI includes smooth animations and responsive design for optimal user experience

