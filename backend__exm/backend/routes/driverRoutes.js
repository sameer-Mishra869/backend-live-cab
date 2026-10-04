const express = require('express');
const router = express.Router();
const {
  registerDriver,
  getAllDrivers,
  getAvailableDrivers,
  getDriverById,
} = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// GET /api/drivers — Sabhi drivers dekho
router.get('/', authMiddleware, getAllDrivers);

// GET /api/drivers/available — Sirf available drivers
router.get('/available', authMiddleware, getAvailableDrivers);

// GET /api/drivers/:id — Ek driver ki detail
router.get('/:id', authMiddleware, getDriverById);

// POST /api/drivers/register — Driver register karo (ADMIN ONLY)
router.post('/register', authMiddleware, adminMiddleware, registerDriver);

module.exports = router;
