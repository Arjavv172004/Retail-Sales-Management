# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- The `truestate_assignment_dataset.csv` file in the project root

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Verify CSV file location:**
   Ensure `truestate_assignment_dataset.csv` is in the project root directory:
   ```
   /TruEstate/truestate_assignment_dataset.csv
   ```

3. **Start the development servers:**

   Option A: Start both servers together
   ```bash
   npm run dev
   ```

   Option B: Start separately
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## First Run

On first run, the backend will:
- Load the CSV file (this may take a few seconds for large files)
- Cache the data in memory
- Log the number of transactions loaded

## Troubleshooting

### CSV file not found
- Ensure the CSV file is named exactly `truestate_assignment_dataset.csv`
- Ensure it's in the project root directory (same level as `package.json`)

### Port already in use
- Backend: Change `PORT` in `backend/.env` or `backend/src/index.js`
- Frontend: Change port in `frontend/vite.config.js`

### Dependencies issues
- Delete `node_modules` folders and `package-lock.json` files
- Run `npm run install:all` again

## Production Build

```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
# Serve with any static file server
```

