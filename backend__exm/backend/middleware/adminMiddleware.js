// Admin Only Middleware — authMiddleware ke BAAD use karo
// req.user pehle se set hona chahiye authMiddleware se
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '❌ Forbidden! Sirf Admin yeh kaam kar sakta hai.',
    });
  }
  next();
};

module.exports = adminMiddleware;
