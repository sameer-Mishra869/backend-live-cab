const jwt = require('jsonwebtoken');

// JWT Auth Middleware — Har protected route pe chalega
const authMiddleware = (req, res, next) => {
  // Authorization header se token lo: "Bearer <token>"
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '❌ Access denied. Token nahi mila. Pehle login karo!',
    });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Token verify karo secret key se
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // User info request mein attach karo
    next(); // Aage jaao
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '❌ Invalid ya expired token! Dobara login karo.',
    });
  }
};

module.exports = authMiddleware;
