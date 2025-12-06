# Troubleshooting Guide

## Port 5000 Already in Use Error

If you see `Error: listen EADDRINUSE: address already in use :::5000`, follow these steps:

### Solution 1: Stop Current Process (Recommended)

1. **In your terminal where `npm run dev` is running:**
   - Press `Ctrl + C` to stop the process
   - Wait a few seconds for it to fully stop

2. **Then restart:**
   ```bash
   npm run dev
   ```

### Solution 2: Kill Port Manually

If Solution 1 doesn't work, manually kill the process:

```bash
# Kill all processes on port 5000
lsof -ti:5000 | xargs kill -9

# Or use the provided script
./scripts/kill-port.sh 5000
```

### Solution 3: Use Different Port

If port 5000 is permanently occupied by another application:

1. **Set a different port for backend:**
   ```bash
   cd backend
   PORT=5001 npm run dev
   ```

2. **Update frontend to use new port:**
   - Edit `frontend/src/services/api.js`
   - Change: `const API_BASE_URL = 'http://localhost:5001/api';`
   - Or set environment variable: `VITE_API_URL=http://localhost:5001/api`

3. **Start frontend separately:**
   ```bash
   cd frontend
   npm run dev
   ```

### Solution 4: Kill All Node Processes

**⚠️ Warning: This will kill ALL Node.js processes on your system**

```bash
pkill -f node
```

Then restart:
```bash
npm run dev
```

## Network Error in Frontend

If you see "Network error" in the browser:

1. **Check if backend is running:**
   - Look for `🚀 Server running on http://localhost:5000` in terminal
   - If not, the backend didn't start successfully

2. **Check backend terminal for errors:**
   - Look for CSV loading messages
   - Check for any error messages

3. **Verify CSV file exists:**
   ```bash
   ls -la truestate_assignment_dataset.csv
   ```
   - File should be in project root

4. **Test backend directly:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   - Should return: `{"status":"ok","message":"Server is running"}`

5. **Check browser console (F12):**
   - Look for detailed error messages
   - Check Network tab to see if requests are failing

## CSV File Not Found

If backend shows "CSV file not found":

1. **Verify file location:**
   ```bash
   ls -la truestate_assignment_dataset.csv
   ```
   - Should be in `/Users/arjavkasliwal/Desktop/TruEstate/`

2. **Check file name:**
   - Must be exactly: `truestate_assignment_dataset.csv`
   - Case-sensitive

3. **Check file permissions:**
   ```bash
   chmod 644 truestate_assignment_dataset.csv
   ```

## Still Having Issues?

1. **Check all terminals:**
   - Make sure you don't have multiple `npm run dev` processes running
   - Close all terminals and start fresh

2. **Clear node processes:**
   ```bash
   pkill -f node
   sleep 2
   npm run dev
   ```

3. **Reinstall dependencies (if needed):**
   ```bash
   rm -rf node_modules backend/node_modules frontend/node_modules
   npm run install:all
   ```

