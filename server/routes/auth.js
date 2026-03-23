const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/connection');
const { authMiddleware } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger'); // adjust path as needed

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const [users] = await pool.query(
      'SELECT * FROM adminpanel_users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      // Log failed attempt — no real user, so we spoof req.user minimally
      await logActivity(req, {
        action: 'LOGIN',
        entityType: 'user',
        entityLabel: username,
        description: `Failed login attempt for username "${username}" — user not found.`,
        status: 'failure',
      });
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      await logActivity(req, {
        action: 'LOGIN',
        entityType: 'user',
        entityId: user.id,
        entityLabel: user.username,
        description: `Failed login attempt for "${user.username}" — incorrect password.`,
        metadata: { userId: user.id, role: user.role },
        status: 'failure',
      });
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (!user.is_active) {
      await logActivity(req, {
        action: 'LOGIN',
        entityType: 'user',
        entityId: user.id,
        entityLabel: user.username,
        description: `Login blocked for "${user.username}" — account inactive (role: ${user.role}).`,
        metadata: { userId: user.id, role: user.role, is_active: false },
        status: 'failure',
      });

      const messages = {
        librarian: 'Your librarian account is currently inactive. Please contact an administrator to activate your account.',
        patron:    'Your account has been deactivated. Please contact an administrator for assistance.',
      };
      return res.status(403).json({
        message: messages[user.role] ?? 'Your account is inactive. Please contact an administrator.',
      });
    }

    await pool.query(
      'UPDATE adminpanel_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, full_name: user.full_name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Attach user to req so logActivity can read it
    req.user = { id: user.id, full_name: user.full_name, role: user.role };

    await logActivity(req, {
      action: 'LOGIN',
      entityType: 'user',
      entityId: user.id,
      entityLabel: user.username,
      description: `"${user.full_name}" (${user.role}) logged in successfully.`,
      metadata: { role: user.role },
      status: 'success',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again.' });
  }
});


// Logout route
router.post('/logout', authMiddleware, async (req, res) => {
  await logActivity(req, {
    action: 'LOGOUT',
    entityType: 'user',
    entityId: req.user.id,
    entityLabel: req.user.username ?? req.user.full_name,
    description: `"${req.user.full_name}" logged out.`,
    status: 'success',
  });

  res.json({ message: 'Logout successful' });
});


// Verify token route
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, full_name, role, is_active, last_login, avatar FROM adminpanel_users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      await logActivity(req, {
        action: 'TOKEN_VERIFY',
        entityType: 'user',
        entityId: req.user.id,
        description: `Token verification failed — user ID ${req.user.id} not found in database.`,
        status: 'failure',
      });
      return res.status(401).json({ message: 'User not found' });
    }

    const user = users[0];

    if (!user.is_active) {
      await logActivity(req, {
        action: 'TOKEN_VERIFY',
        entityType: 'user',
        entityId: user.id,
        entityLabel: user.username,
        description: `Token verification failed — account for "${user.username}" is deactivated.`,
        status: 'failure',
      });
      return res.status(403).json({
        message: 'Your account has been deactivated',
        requiresLogout: true,
      });
    }

    // Successful verify — logged at debug level only (optional, remove if too noisy)
    await logActivity(req, {
      action: 'TOKEN_VERIFY',
      entityType: 'user',
      entityId: user.id,
      entityLabel: user.username,
      description: `Token verified for "${user.full_name}" (${user.role}).`,
      status: 'success',
    });

    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
        last_login: user.last_login,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;