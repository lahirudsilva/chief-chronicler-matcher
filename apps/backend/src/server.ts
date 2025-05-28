import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { verifyWithExample } from './services/locationMatcher';


const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://chronicler-frontend.vercel.app',
            'https://chronicler-frontend-git-master.vercel.app',
            'https://chronicler-frontend-yourusername.vercel.app'
        ]
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
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

// For Vercel deployment
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local development
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;