# Architecture Documentation

## System Overview

The Retail Sales Management System is a full-stack application designed to handle large-scale sales data (1M+ records) with advanced search, filtering, sorting, and pagination capabilities. The system follows a clean, modular architecture with clear separation of concerns.

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Data Processing**: csv-parser for efficient CSV parsing
- **Caching**: In-memory caching for loaded transactions

### Folder Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   └── transactionController.js
│   ├── services/           # Business logic
│   │   └── transactionService.js
│   ├── routes/             # API route definitions
│   │   └── transactionRoutes.js
│   ├── utils/              # Utility functions
│   │   ├── csvLoader.js    # CSV loading and caching
│   │   ├── filterUtils.js  # Filtering logic
│   │   └── sortUtils.js    # Sorting logic
│   └── index.js           # Application entry point
├── package.json
└── README.md
```

### Module Responsibilities

#### Controllers (`controllers/transactionController.js`)
- Handle HTTP requests and responses
- Validate input parameters
- Call service methods
- Format API responses
- Handle errors and return appropriate status codes

#### Services (`services/transactionService.js`)
- Business logic for data processing
- Parse filter parameters from query strings
- Coordinate filtering, sorting, and pagination
- Extract unique filter options from dataset
- Return structured data with pagination metadata

#### Utils

**csvLoader.js:**
- Load and parse CSV file into memory
- Implement caching mechanism to avoid reloading
- Transform raw CSV rows into structured transaction objects
- Handle file I/O errors gracefully

**filterUtils.js:**
- Implement individual filter matching functions
- Support multi-select filters (OR logic within filter)
- Support range filters (age, date)
- Combine all filters with AND logic
- Case-insensitive search matching

**sortUtils.js:**
- Sort transactions by different fields
- Support ascending and descending order
- Handle special cases (date sorting defaults to newest first)

#### Routes (`routes/transactionRoutes.js`)
- Define API endpoints
- Map routes to controller methods
- Handle route-level middleware if needed

### Data Flow

1. **Initial Load:**
   - Server starts and loads CSV file into memory
   - Data is cached for subsequent requests
   - Loading progress is logged

2. **API Request Flow:**
   ```
   Client Request
   → Route Handler
   → Controller
   → Service (parse filters, apply filters, sort, paginate)
   → Utils (filtering, sorting logic)
   → Response with data + pagination metadata
   ```

3. **Filtering Process:**
   - Parse query parameters into filter objects
   - Apply search filter (case-insensitive)
   - Apply multi-select filters (regions, genders, etc.)
   - Apply range filters (age, date)
   - Combine all filters with AND logic

4. **Sorting Process:**
   - Apply sorting after filtering
   - Sort by specified field and order
   - Return sorted array

5. **Pagination Process:**
   - Calculate total pages from filtered/sorted results
   - Slice array based on page and limit
   - Return paginated data with metadata

### Performance Optimizations

- **Caching**: CSV data loaded once and cached in memory
- **Efficient Filtering**: Array filtering operations are optimized
- **Lazy Loading**: Data loaded only when needed
- **Memory Management**: Large dataset handled efficiently

## Frontend Architecture

### Technology Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Folder Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── SearchBar.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── TransactionTable.jsx
│   │   ├── SortDropdown.jsx
│   │   └── Pagination.jsx
│   ├── pages/              # Page components
│   │   └── Dashboard.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useTransactions.js
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── public/
├── package.json
└── README.md
```

### Component Hierarchy

```
App
└── QueryClientProvider
    └── BrowserRouter
        └── Routes
            └── Dashboard
                ├── Header
                └── Main Content
                    ├── FilterPanel (Sidebar)
                    └── Content Area
                        ├── SearchBar
                        ├── SortDropdown
                        ├── TransactionTable
                        └── Pagination
```

### Module Responsibilities

#### Components

**SearchBar.jsx:**
- Real-time search input with debouncing
- Clear button functionality
- Smooth animations on focus/blur

**FilterPanel.jsx:**
- Multi-select filter checkboxes
- Range inputs for age and date
- Collapsible filter sections
- Clear all filters functionality
- Visual feedback for active filters

**TransactionTable.jsx:**
- Display transactions in table format
- Sortable column headers
- Row hover effects
- Status badges with color coding
- Responsive design

**SortDropdown.jsx:**
- Dropdown for sort options
- Visual indication of current sort

**Pagination.jsx:**
- Page number buttons
- Previous/Next navigation
- Ellipsis for large page counts
- Smooth page transitions

#### Pages

**Dashboard.jsx:**
- Main application page
- State management for filters, search, sort, pagination
- Debounced search implementation
- Coordinate all child components
- Handle loading and error states

#### Hooks

**useTransactions.js:**
- React Query hook for fetching transactions
- Transform filter objects to query parameters
- Handle API communication
- Cache management

#### Services

**api.js:**
- Axios instance configuration
- API endpoint definitions
- Request/response interceptors (if needed)

### State Management

**Local State (Dashboard):**
- `search`: Current search term
- `debouncedSearch`: Debounced search term (300ms delay)
- `filters`: Filter object with all filter values
- `sort`: Sort field and order
- `page`: Current page number

**Server State (React Query):**
- Transaction data
- Filter options
- Automatic caching and refetching

### Data Flow

1. **User Interaction:**
   - User types in search → updates `search` state
   - Debounce timer waits 300ms → updates `debouncedSearch`
   - `debouncedSearch` triggers new API call

2. **Filter Changes:**
   - User selects/deselects filters → updates `filters` state
   - State change triggers new API call via React Query
   - Page resets to 1

3. **Sort Changes:**
   - User selects sort option → updates `sort` state
   - State change triggers new API call
   - Page resets to 1

4. **Pagination:**
   - User clicks page number → updates `page` state
   - State change triggers new API call with new page
   - Scrolls to top smoothly

5. **API Response:**
   - React Query caches response
   - Components re-render with new data
   - Loading states handled automatically

### UI/UX Features

- **Animations**: Framer Motion for smooth transitions
- **Responsive Design**: Mobile-friendly layout
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation, ARIA labels
- **Performance**: Debounced search, optimized re-renders

## API Design

### Endpoints

**GET /api/transactions**
- Query parameters for filtering, sorting, pagination
- Returns paginated transaction data with metadata

**GET /api/transactions/filter-options**
- Returns available filter options (regions, genders, categories, etc.)
- Cached for 5 minutes on frontend

### Response Format

```json
{
  "data": [...transactions],
  "pagination": {
    "currentPage": 1,
    "totalPages": 100,
    "totalRecords": 1000,
    "limit": 10
  }
}
```

## Edge Cases Handled

1. **Empty Results**: Shows friendly message when no transactions match
2. **Invalid Ranges**: Age/date range validation
3. **Missing Fields**: Handles optional/missing data gracefully
4. **Large Datasets**: Efficient filtering and pagination
5. **Network Errors**: Error boundaries and retry logic
6. **Loading States**: Prevents multiple simultaneous requests
7. **Filter Conflicts**: All filters work independently and in combination

## Security Considerations

- CORS enabled for frontend-backend communication
- Input validation on backend
- No sensitive data exposure
- Error messages don't leak system details

## Future Enhancements

- Database integration for better performance
- Export functionality (CSV, PDF)
- Advanced analytics and charts
- User authentication and authorization
- Real-time updates
- Bulk operations

