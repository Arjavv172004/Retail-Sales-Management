import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'net';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
const DEFAULT_PORT = 5000;
const PORT = process.env.PORT || DEFAULT_PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};

// Start server with error handling
const startServer = async () => {
  try {
    let serverPort = PORT;
    
    // Check if default port is available, if not find alternative
    if (PORT === DEFAULT_PORT) {
      const testServer = createServer();
      
      await new Promise((resolve) => {
        testServer.once('error', async (err) => {
          if (err.code === 'EADDRINUSE') {
            console.warn(`⚠️  Port ${PORT} is in use, trying alternative port...`);
            try {
              serverPort = await findAvailablePort(PORT + 1);
              console.log(`🔄 Using port ${serverPort} instead`);
            } catch (findError) {
              console.error('❌ Could not find available port');
              process.exit(1);
            }
          }
          testServer.close();
          resolve();
        });
        
        testServer.once('listening', () => {
          testServer.close();
          resolve();
        });
        
        testServer.listen(PORT);
      });
    }

    const server = app.listen(serverPort, () => {
      console.log(`🚀 Server running on http://localhost:${serverPort}`);
      console.log(`📊 API available at http://localhost:${serverPort}/api`);
      if (serverPort !== PORT) {
        console.log(`\n⚠️  NOTE: Frontend is configured for port ${PORT}.`);
        console.log(`   Update frontend/src/services/api.js or set VITE_API_URL=http://localhost:${serverPort}/api`);
      }
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${serverPort} is already in use.`);
        console.error(`💡 Solutions:`);
        console.error(`   1. Stop all node processes: pkill -f node`);
        console.error(`   2. Kill port specifically: lsof -ti:${serverPort} | xargs kill -9`);
        console.error(`   3. Use a different port: PORT=5001 npm run dev`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

