import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { verifyWithExample } from './services/locationMatcher';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS middleware with specific origins
app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://chief-chronicler-matcher-frontend.vercel.app', // Production frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Add JSON parsing middleware
app.use(express.json());

// Create tRPC Express middleware and mount it
app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
}));

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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Chief Chronicler Location Matcher API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      trpc: '/trpc',
      docs: 'https://trpc.io/docs'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 Root endpoint: http://localhost:${PORT}/`);
  
  // Verify algorithm on startup
  const algorithmWorks = verifyWithExample();
  console.log(`🧮 Algorithm verification: ${algorithmWorks ? '✅ PASSED' : '❌ FAILED'}`);
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;