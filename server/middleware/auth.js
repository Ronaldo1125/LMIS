const jwt = require('jsonwebtoken');

// Middleware to verify JWT token (blocks request if no/invalid token)
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize: admins use 'role', regular users use 'user_type'
    decoded.role = decoded.role || decoded.user_type || null;

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Token expired' });
    if (error.name === 'JsonWebTokenError')
      return res.status(401).json({ message: 'Invalid token' });
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware that attaches user info if a token is present,
// but does NOT block the request if there's no token.
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── FIX: same normalization as authMiddleware ──────────────────────────
    decoded.role = decoded.role || decoded.user_type || null;

    req.user = decoded;
    next();

  } catch (error) {
    // Token present but invalid/expired — treat as guest
    req.user = null;
    next();
  }
};

// Middleware to check user role.
const roleMiddleware = (...allowedRoles) => {
  const roles = allowedRoles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied. Insufficient permissions.',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  roleMiddleware
};