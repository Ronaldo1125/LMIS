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

    // First, check if user exists (without is_active filter)
    const [users] = await pool.query(
      'SELECT * FROM adminpanel_users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if account is inactive
    if (!user.is_active) {
      if (user.role === 'librarian') {
        return res.status(403).json({ 
          message: 'Your librarian account is currently inactive. Please contact an administrator to activate your account.' 
        });
      } else if (user.role === 'patron') {
        return res.status(403).json({ 
          message: 'Your account has been deactivated. Please contact an administrator for assistance.' 
        });
      } else {
        return res.status(403).json({ 
          message: 'Your account is inactive. Please contact an administrator.' 
        });
      }
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
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again.' });
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
      'SELECT id, username, full_name, role, is_active, last_login FROM adminpanel_users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = users[0];

    // Check if user is still active
    if (!user.is_active) {
      return res.status(403).json({ 
        message: 'Your account has been deactivated',
        requiresLogout: true 
      });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
        last_login: user.last_login
      }
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;