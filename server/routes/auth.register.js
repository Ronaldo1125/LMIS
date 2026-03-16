const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool    = require('../config/connection');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ── helpers ── */
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, user_type: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const safeUser = (u) => ({
  id: u.id, username: u.username, email: u.email,
  full_name: u.full_name, user_type: u.user_type,
  is_active: u.is_active, created_at: u.created_at,
  avatar: u.avatar ?? null, 
});

const isValidUsername = (u) => /^[a-zA-Z0-9_]{3,30}$/.test(u);

/* ═══════════════════════════════════════════════════════
   POST /api/auth/register
   Regular email + password registration
   Body: { full_name, email, username, password }
═══════════════════════════════════════════════════════ */
router.post('/register', async (req, res) => {
  const { full_name, email, username, password } = req.body;

  if (!full_name || !email || !username || !password)
    return res.status(400).json({ message: 'All fields are required.' });

  if (password.length < 8)
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: 'Please provide a valid email address.' });

  if (!isValidUsername(username))
    return res.status(400).json({ message: 'Username must be 3–30 characters (letters, numbers, underscores only).' });

  try {
    // Check email
    const [byEmail] = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (byEmail.length > 0)
      return res.status(409).json({ message: 'An account with this email already exists.' });

    // Check username
    const [byUsername] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (byUsername.length > 0)
      return res.status(409).json({ message: 'That username is already taken. Please choose another.' });

    const password_hash = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, user_type, is_active)
       VALUES (?, ?, ?, ?, 'Patron', 1)`,
      [username, email.toLowerCase(), password_hash, full_name.trim()]
    );

    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      message: 'Account created successfully.',
      token: signToken(user),
      user: safeUser(user),
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

/* ═══════════════════════════════════════════════════════
   POST /api/auth/google/register
   Two-step Google registration:
   Frontend sends Google credential PLUS the user-filled
   profile fields (full_name, username).
   Body: { credential, full_name, username }
═══════════════════════════════════════════════════════ */
router.post('/google/register', async (req, res) => {
  const { credential, full_name, username } = req.body;

  if (!credential || !full_name || !username)
    return res.status(400).json({ message: 'Google credential, full name, and username are required.' });

  if (!isValidUsername(username))
    return res.status(400).json({ message: 'Username must be 3–30 characters (letters, numbers, underscores only).' });

  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();

    if (!email)
      return res.status(400).json({ message: 'Could not retrieve email from Google account.' });

    // Reject if email already registered
    const [byEmail] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (byEmail.length > 0) {
      // Already exists → treat as a login instead of throwing an error
      const existing = byEmail[0];
      if (!existing.is_active)
        return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });

      return res.status(200).json({
        message: 'Welcome back! You already have an account.',
        token: signToken(existing),
        user: safeUser(existing),
      });
    }

    // Check username availability
    const [byUsername] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
    if (byUsername.length > 0)
      return res.status(409).json({ message: 'That username is already taken. Please choose another.' });

    // Create account
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, user_type, is_active)
       VALUES (?, ?, 'GOOGLE_OAUTH', ?, 'Patron', 1)`,
      [username, email.toLowerCase(), full_name.trim()]
    );

    const [[user]] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      message: 'Account created successfully.',
      token: signToken(user),
      user: safeUser(user),
    });
  } catch (err) {
    console.error('Google register error:', err);
    if (err.message?.includes('Token used too late') || err.message?.includes('Invalid token'))
      return res.status(401).json({ message: 'Invalid or expired Google token. Please try again.' });
    return res.status(500).json({ message: 'Server error during Google registration.' });
  }
});

/* ═══════════════════════════════════════════════════════
   POST /api/auth/google   (kept for Login flow)
   Body: { credential }
═══════════════════════════════════════════════════════ */
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential)
    return res.status(400).json({ message: 'Google credential token is required.' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email } = ticket.getPayload();

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'No account found with this Google email. Please register first.' });

    const user = rows[0];
    if (!user.is_active)
      return res.status(403).json({ message: 'Your account has been deactivated.' });

    return res.status(200).json({
      message: 'Login successful.',
      token: signToken(user),
      user: safeUser(user),
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(500).json({ message: 'Server error during Google login.' });
  }
});

/* ═══════════════════════════════════════════════════════
   PATCH /api/auth/:id/profile
   Update profile fields for Patron/Staff accounts only.
   Scoped strictly to the `users` table — never touches
   `adminpanel_users` (admins/librarians have their own routes).
═══════════════════════════════════════════════════════ */
router.patch('/:id/profile', async (req, res) => {
  const { id } = req.params;
  const { full_name, username, email, avatar } = req.body;

  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: 'Invalid account ID.' });

  try {
    const [userRows] = await pool.query(
      'SELECT id FROM users WHERE id = ?', [id]
    );
    if (userRows.length === 0)
      return res.status(404).json({ message: 'Account not found.' });

    await pool.query(
      `UPDATE users
       SET full_name = COALESCE(?, full_name),
           username  = COALESCE(?, username),
           email     = COALESCE(?, email),
           avatar    = COALESCE(?, avatar)
       WHERE id = ?`,
      [full_name ?? null, username ?? null, email ?? null, avatar ?? null, id]
    );

    res.json({ message: 'Profile updated.' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile.' });
  }
});

/* ═══════════════════════════════════════════════════════
   DELETE /api/auth/:id
   Permanently delete a Patron/Staff account.
   Scoped strictly to the `users` table — adminpanel_users
   accounts are never touched here.
═══════════════════════════════════════════════════════ */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id)))
    return res.status(400).json({ message: 'Invalid account ID.' });

  try {
    // Only allow deletion of rows in the `users` table
    const [userRows] = await pool.query(
      'SELECT id, user_type FROM users WHERE id = ?', [id]
    );
    if (userRows.length === 0)
      return res.status(404).json({ message: 'Account not found.' });

    // Delete related data first to respect FK constraints.
    // Extend this list to match your actual schema.
    await pool.query('DELETE FROM bookmarks WHERE user_id = ?', [id]);
    await pool.query('DELETE FROM borrows   WHERE user_id = ?', [id]);
    await pool.query('DELETE FROM users     WHERE id      = ?', [id]);

    return res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('Delete account error:', err);
    return res.status(500).json({ message: 'Server error while deleting account.' });
  }
});

module.exports = router;