const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register — Naya customer register karo
router.post('/register', register);

// POST /api/auth/login — Login karo, token milega
router.post('/login', login);

// GET /api/auth/me — Apna profile dekho (token required)
router.get('/me', authMiddleware, getProfile);

module.exports = router;
