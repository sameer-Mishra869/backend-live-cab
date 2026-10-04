const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  completeBooking,
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// POST /api/bookings — Naya ride book karo (driver conflict check hoga)
router.post('/', authMiddleware, createBooking);

// GET /api/bookings/my — Apni bookings dekho
router.get('/my', authMiddleware, getMyBookings);

// GET /api/bookings — Sabhi bookings dekho (ADMIN ONLY)
router.get('/', authMiddleware, adminMiddleware, getAllBookings);

// GET /api/bookings/:id — Ek booking ki detail
router.get('/:id', authMiddleware, getBookingById);

// PATCH /api/bookings/:id/cancel — Booking cancel karo
router.patch('/:id/cancel', authMiddleware, cancelBooking);

// PATCH /api/bookings/:id/complete — Ride complete mark karo (ADMIN ONLY)
router.patch('/:id/complete', authMiddleware, adminMiddleware, completeBooking);

module.exports = router;
