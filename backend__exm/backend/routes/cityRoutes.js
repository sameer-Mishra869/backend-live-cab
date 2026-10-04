const express = require('express');
const router = express.Router();
const {
  createCity,
  getAllCities,
  getCityById,
  updateCityRates,
  deleteCity,
} = require('../controllers/cityController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// GET /api/cities — Sabhi cities dekho (login required)
router.get('/', authMiddleware, getAllCities);

// GET /api/cities/:id — Ek city dekho
router.get('/:id', authMiddleware, getCityById);

// POST /api/cities — City banao (ADMIN ONLY)
router.post('/', authMiddleware, adminMiddleware, createCity);

// PATCH /api/cities/:id/rates — City ka rate update karo (ADMIN ONLY)
router.patch('/:id/rates', authMiddleware, adminMiddleware, updateCityRates);

// DELETE /api/cities/:id — City delete karo (ADMIN ONLY)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCity);

module.exports = router;
