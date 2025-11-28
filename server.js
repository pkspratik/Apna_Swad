const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Helper function to wrap serverless functions for Express
const wrapServerlessFunction = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Handler error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
      }
    }
  };
};

// API Routes
app.post('/api/auth/login', wrapServerlessFunction(require('./api/auth/login')));
app.post('/api/auth/signup', wrapServerlessFunction(require('./api/auth/signup')));

// Orders routes
app.get('/api/orders', wrapServerlessFunction(require('./api/orders/index')));
app.post('/api/orders', wrapServerlessFunction(require('./api/orders/index')));
app.post('/api/orders/create', wrapServerlessFunction(require('./api/orders/create')));
app.get('/api/orders/user/list', wrapServerlessFunction(require('./api/orders/user/list')));
app.get('/api/orders/seller/list', wrapServerlessFunction(require('./api/orders/seller/list')));

// Dynamic route for order by ID
app.get('/api/orders/:id', wrapServerlessFunction(require('./api/orders/[id]')));
app.put('/api/orders/:id', wrapServerlessFunction(require('./api/orders/[id]')));

// Dynamic route for order status update
app.put('/api/orders/:id/status', wrapServerlessFunction(require('./api/orders/[id]/status')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: 'Server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
  console.log(`✅ Ready to handle requests from frontend on http://localhost:3000`);
});
