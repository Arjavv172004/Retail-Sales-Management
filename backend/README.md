# Backend API

## Overview

RESTful API for Retail Sales Management System built with Express.js. Handles efficient processing of large CSV datasets with search, filtering, sorting, and pagination.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure `truestate_assignment_dataset.csv` is in the project root

3. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### GET /api/transactions

Get paginated transactions with optional search, filters, and sorting.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for Customer Name or Phone Number
- `region` (string): Comma-separated Customer Regions
- `gender` (string): Comma-separated Genders
- `ageMin` (number): Minimum age
- `ageMax` (number): Maximum age
- `category` (string): Comma-separated Product Categories
- `tags` (string): Comma-separated Tags
- `paymentMethod` (string): Comma-separated Payment Methods
- `dateFrom` (string): Start date (YYYY-MM-DD)
- `dateTo` (string): End date (YYYY-MM-DD)
- `sortBy` (string): Sort field (date, quantity, customerName)
- `sortOrder` (string): Sort order (asc, desc)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 100,
    "totalRecords": 1000,
    "limit": 10
  }
}
```

## Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic for data processing
- **Utils**: Helper functions for CSV parsing and data manipulation
- **Routes**: API route definitions

