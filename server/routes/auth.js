const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/connection');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Query admin from database
    const [admins] = await pool.query(
      'SELECT * FROM admins WHERE username = ? AND is_active = TRUE',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await pool.query(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [admin.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        full_name: admin.full_name,
        last_login: admin.last_login
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout route
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Verify token route
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const [admins] = await pool.query(
      'SELECT id, username, full_name, last_login FROM admins WHERE id = ? AND is_active = TRUE',
      [req.user.id]
    );

    if (admins.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      valid: true,
      admin: admins[0]
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;