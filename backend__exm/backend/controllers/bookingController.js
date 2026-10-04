const RideBooking = require('../models/RideBooking');
const City = require('../models/City');
const Driver = require('../models/Driver');

// ===========================
// CREATE BOOKING — POST /api/bookings
// ===========================
const createBooking = async (req, res) => {
  try {
    const {
      cityId,
      driverId,
      pickupLocation,
      dropLocation,
      distanceKm,
      rideDate,
      startTime,
      endTime,
    } = req.body;

    const customerId = req.user.id; // JWT middleware se milega

    // --- Basic Validation ---
    if (!cityId || !driverId || !pickupLocation || !dropLocation || !distanceKm || !rideDate || !startTime) {
      return res.status(400).json({ success: false, message: 'Sabhi fields required hain!' });
    }

    // Auto-calculate endTime if not provided (1 hour default duration)
    let calcEndTime = endTime;
    if (!calcEndTime) {
      const [h, m] = startTime.split(':').map(Number);
      const endH = (h + 1) % 24;
      calcEndTime = `${endH < 10 ? '0' + endH : endH}:${m < 10 ? '0' + m : m}`;
    }

    // --- Driver exist check ---
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: '❌ Driver nahi mila!' });
    }

    // ============================================================
    // 🔥 DRIVER CONFLICT CHECK — Exam ka most important part!
    // ============================================================
    const rideDateObj = new Date(rideDate);
    rideDateObj.setHours(0, 0, 0, 0);

    const conflictingRide = await RideBooking.findOne({
      driver: driverId,
      rideDate: rideDateObj,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lt: calcEndTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (conflictingRide) {
      return res.status(409).json({
        success: false,
        message: `❌ Driver "${driver.name}" is time pe available nahi hai!`,
        conflictDetails: {
          existingRide: {
            date: conflictingRide.rideDate,
            time: `${conflictingRide.startTime}`,
          },
          suggestion: 'Doosra driver choose karo ya alag time slot lo.',
        },
      });
    }

    // --- City dhundo fare ke liye ---
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: '❌ City nahi mili!' });
    }

    // --- Fare Calculate karo ---
    const fare = city.baseRate + city.perKmRate * distanceKm;

    // --- Booking banao ---
    const booking = new RideBooking({
      city: cityId,
      driver: driverId,
      customer: customerId,
      pickupLocation,
      dropLocation,
      distanceKm,
      fare: parseFloat(fare.toFixed(2)),
      rideDate: rideDateObj,
      startTime,
      endTime: calcEndTime,
      status: 'confirmed',
    });

    await booking.save();

    await booking.populate([
      { path: 'city', select: 'name baseRate perKmRate' },
      { path: 'driver', select: 'name vehicleNumber vehicleType phone' },
      { path: 'customer', select: 'name email phone' },
    ]);

    res.status(201).json({
      success: true,
      message: '✅ Ride booked successfully!',
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET MY BOOKINGS — GET /api/bookings/my
// ===========================
const getMyBookings = async (req, res) => {
  try {
    const bookings = await RideBooking.find({ customer: req.user.id })
      .populate('city', 'name baseRate perKmRate')
      .populate('driver', 'name vehicleNumber phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET ALL BOOKINGS — GET /api/bookings  [Admin only]
// ===========================
const getAllBookings = async (req, res) => {
  try {
    const bookings = await RideBooking.find()
      .populate('city', 'name')
      .populate('driver', 'name vehicleNumber')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET SINGLE BOOKING — GET /api/bookings/:id
// ===========================
const getBookingById = async (req, res) => {
  try {
    const booking = await RideBooking.findById(req.params.id)
      .populate('city', 'name baseRate perKmRate')
      .populate('driver', 'name vehicleNumber phone vehicleType')
      .populate('customer', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking nahi mili!' });
    }

    const custId = booking.customer._id ? booking.customer._id.toString() : booking.customer.toString();
    if (req.user.role !== 'admin' && custId !== req.user.id) {
      return res.status(403).json({ success: false, message: '❌ Yeh teri booking nahi hai!' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// CANCEL BOOKING — PATCH /api/bookings/:id/cancel
// ===========================
const cancelBooking = async (req, res) => {
  try {
    const booking = await RideBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking nahi mili!' });
    }

    const custId = booking.customer._id ? booking.customer._id.toString() : booking.customer.toString();
    if (req.user.role !== 'admin' && custId !== req.user.id) {
      return res.status(403).json({ success: false, message: '❌ Yeh teri booking nahi hai!' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled hai!' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Completed ride cancel nahi ho sakti!' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: '✅ Booking cancelled successfully!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// COMPLETE BOOKING — PATCH /api/bookings/:id/complete  [Admin only]
// ===========================
const completeBooking = async (req, res) => {
  try {
    const booking = await RideBooking.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    if (!booking) return res.status(404).json({ success: false, message: 'Booking nahi mili!' });

    res.json({ success: true, message: '✅ Ride marked as completed!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  completeBooking,
};
