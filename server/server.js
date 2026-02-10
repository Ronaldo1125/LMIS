const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Serve uploaded files statically (optional - if you want direct access)
// Note: The download route handles authentication, so this is optional
// If you want public access to files, uncomment the line below:
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Library Management System API v1.0' });
});

// Auth routes
app.use('/api/auth', authRoutes);

const adminpanelUsersRoutes = require('./routes/adminpanelUsers');
app.use('/api/adminpanel-users', adminpanelUsersRoutes);

// Books routes
const booksRoutes = require('./routes/books');
app.use('/api/books', booksRoutes);

// Uploads routes - handles file upload/download with authentication
const uploadsRoutes = require('./routes/uploads');
app.use('/api/uploads', uploadsRoutes);

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