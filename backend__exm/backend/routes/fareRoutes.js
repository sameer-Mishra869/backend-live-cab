const express = require('express');
const router = express.Router();
const { estimateFare } = require('../controllers/fareController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/fare/estimate — Fare estimate karo (login required)
router.post('/estimate', authMiddleware, estimateFare);

module.exports = router;
