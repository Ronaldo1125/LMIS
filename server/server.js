const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { authMiddleware, roleMiddleware } = require('./middleware/auth');
const pool = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Library Management System API v1.0' });
});

// Auth routes
app.use('/api/auth', authRoutes);

const adminpanelUsersRoutes = require('./routes/adminpanelUsers');
app.use('/api/adminpanel-users', adminpanelUsersRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize and start server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();