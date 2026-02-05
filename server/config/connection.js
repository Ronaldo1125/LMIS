// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mysql = require('mysql2');

// Log what we're receiving (for debugging)
console.log('🔍 Environment check:', {
  hasHost: !!process.env.MYSQLHOST,
  hasUser: !!process.env.MYSQLUSER,
  hasPassword: !!process.env.MYSQLPASSWORD,
  hasDatabase: !!process.env.MYSQLDATABASE,
  hasPort: !!process.env.MYSQLPORT,
  nodeEnv: process.env.NODE_ENV
});

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: parseInt(process.env.MYSQLPORT || '3306'),
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection on startup
pool.promise().query('SELECT 1')
  .then(() => {
    console.log('✅ Database connection successful');
    console.log('✅ Host:', process.env.MYSQLHOST);
    console.log('✅ Database:', process.env.MYSQLDATABASE);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('Connection details:', {
      host: process.env.MYSQLHOST,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER,
      hasPassword: !!process.env.MYSQLPASSWORD
    });
  });

module.exports = pool.promise();