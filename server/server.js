const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { authMiddleware, roleMiddleware } = require('./middleware/auth');
const pool = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration allows the frontend(s) to communicate with the API.
// By default we read the single FRONTEND_URL environment variable, but
// during local development we often run the client on a different port
// (Vite uses 5173).  To avoid constantly changing the .env file, build a
// small whitelist and perform a runtime check.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests like curl/postman
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Library Management System API v1.0' });
});

// Auth routes (handles /register, /google, /google/register)
const authRegisterRoutes = require('./routes/auth.register');
// Additional auth routes (login/logout/verify) are kept in a separate file
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRegisterRoutes);
app.use('/api/auth', authRoutes);

// Admin panel users
const adminpanelUsersRoutes = require('./routes/adminpanelUsers');
app.use('/api/adminpanel-users', adminpanelUsersRoutes);

// Books
const booksRoutes = require('./routes/books');
app.use('/api/books', booksRoutes);

// Uploads
const uploadsRoutes = require('./routes/uploads');
app.use('/api/uploads', uploadsRoutes);

// Books Excel import
const importBooksRoute = require('./routes/importBooks');
app.use('/api/books', importBooksRoute);

// Accessions
const accessionsRoutes = require('./routes/accessions');
app.use('/api/accessions', accessionsRoutes);

// Acquisitions
const acquisitionsRoutes = require('./routes/acquisitions');
app.use('/api/acquisitions', acquisitionsRoutes);

// News & Announcements
const newsAnnouncementsRoutes = require('./routes/newsAnnouncements');
app.use('/api', newsAnnouncementsRoutes);

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

// Start server
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