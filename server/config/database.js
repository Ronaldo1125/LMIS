const pool = require('./connection');

const testConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

module.exports = { testConnection };