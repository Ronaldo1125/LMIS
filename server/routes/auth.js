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

    const [users] = await pool.query(
      'SELECT * FROM adminpanel_users WHERE username = ? AND is_active = TRUE',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login timestamp
    await pool.query(
      'UPDATE adminpanel_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// Logout route
router.post('/logout', authMiddleware, (req, res) => {
  // In a JWT-based system, logout is handled client-side by removing the token
  // Optionally, you could maintain a token blacklist here
  res.json({ message: 'Logout successful' });
});

// Verify token route
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, full_name, role, last_login FROM adminpanel_users WHERE id = ? AND is_active = TRUE',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      valid: true,
      user: users[0]
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;