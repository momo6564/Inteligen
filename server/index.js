require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const businessRoutes = require('./routes/businessRoutes');
const reviewRoutes = require('./routes/reviews');

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://sayrab.vercel.app',
      'https://sayrab-git-main-momo6564s-projects.vercel.app',
      'https://sayrab-momo6564s-projects.vercel.app'
    ];
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/businesses', businessRoutes);
app.use('/api/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Business Directory API is running',
    endpoints: {
      businesses: '/api/businesses',
      reviews: '/api/reviews'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// MongoDB Connection with retry logic
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Connected to MongoDB');
      return true;
    } catch (error) {
      console.error(`MongoDB connection attempt ${retries + 1} failed:`, error.message);
      retries++;
      if (retries === MAX_RETRIES) {
        console.error('Failed to connect to MongoDB after maximum retries');
        return false;
      }
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableEndpoints: {
      businesses: '/api/businesses',
      reviews: '/api/reviews',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server only after attempting database connection
const startServer = async () => {
  const PORT = process.env.PORT || 5001;
  
  const dbConnected = await connectDB();
  if (!dbConnected && process.env.NODE_ENV === 'production') {
    console.error('Could not start server due to database connection failure');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('CORS Origin:', process.env.CORS_ORIGIN);
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 
