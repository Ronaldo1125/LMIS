const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { authMiddleware, roleMiddleware } = require('./middleware/auth');
const pool = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://192.168.1.94:3000',
  'http://192.168.1.94:3001'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('/{*any}', cors());

app.use(express.json());

// Serve uploaded files (thumbnails, attachments, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Library Management System API v1.0' });
});

const authRegisterRoutes = require('./routes/auth.register');
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRegisterRoutes);
app.use('/api/auth', authRoutes);

const adminpanelUsersRoutes = require('./routes/adminpanelUsers');
app.use('/api/adminpanel-users', adminpanelUsersRoutes);

const userTypeRoutes = require('./routes/userType');
app.use('/api/usertype', userTypeRoutes);

const booksRoutes = require('./routes/books');
app.use('/api/books', booksRoutes);

const uploadsRoutes = require('./routes/uploads');
app.use('/api/uploads', uploadsRoutes);

const importBooksRoute = require('./routes/importBooks');
app.use('/api/books', importBooksRoute);

const bookCover = require("./routes/bookCover");
app.use("/api/book-cover", bookCover);

const searchRoute = require('./routes/search');
app.use('/api/search', searchRoute);

const accessionsRoutes = require('./routes/accessions');
app.use('/api/accessions', accessionsRoutes);

const bookDetailsRoutes = require('./routes/bookDetails');
app.use('/api/book-details', bookDetailsRoutes);

const mostSearchedRouter = require("./routes/mostSearched");
app.use("/api/most-searched", mostSearchedRouter);

const acquisitionsRoutes = require('./routes/acquisitions');
app.use('/api/acquisitions', acquisitionsRoutes);

const newsAnnouncementsRoutes = require('./routes/newsAnnouncements');
app.use('/api', newsAnnouncementsRoutes);

const bookmarksRouter = require('./routes/bookmarks');
app.use('/api/bookmarks', bookmarksRouter);

const activityLogsRoutes = require('./routes/activityLogs');
app.use('/api/activity-logs', activityLogsRoutes);

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