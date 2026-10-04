const mongoose = require('mongoose');

const rideBookingSchema = new mongoose.Schema(
  {
    // City reference — city se rate lenge fare calculation ke liye
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City is required'],
    },
    // Driver reference — conflict check ke liye
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver is required'],
    },
    // Customer reference — JWT se milega
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
    },
    dropLocation: {
      type: String,
      required: [true, 'Drop location is required'],
    },
    distanceKm: {
      type: Number,
      required: [true, 'Distance is required'],
      min: [0.1, 'Distance must be at least 0.1 km'],
    },
    // Calculated fare — baseRate + (perKmRate x distanceKm)
    fare: {
      type: Number,
      required: true,
    },
    rideDate: {
      type: Date,
      required: [true, 'Ride date is required'],
    },
    startTime: {
      type: String, // "10:00" format (HH:MM)
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RideBooking', rideBookingSchema);
