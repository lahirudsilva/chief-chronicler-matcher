import express from 'express';
import cors from 'cors';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './router';
import { verifyWithExample } from './services/locationMatcher';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Create tRPC server
const server = createHTTPServer({
  router: appRouter,
  createContext: () => ({}),
});

// Mount tRPC handler
app.use('/trpc', server);

// Health check endpoint
app.get('/health', (req, res) => {
  const algorithmWorks = verifyWithExample();
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Chief Chronicler Location Matcher API',
    algorithmVerified: algorithmWorks
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  
  // Verify algorithm on startup
  const algorithmWorks = verifyWithExample();
  console.log(`🧮 Algorithm verification: ${algorithmWorks ? '✅ PASSED' : '❌ FAILED'}`);
});