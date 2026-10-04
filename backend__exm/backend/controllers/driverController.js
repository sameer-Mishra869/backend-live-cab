const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');

// ===========================
// REGISTER DRIVER — POST /api/drivers/register  [Admin only]
// ===========================
const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleNumber, vehicleType } = req.body;

    if (!name || !email || !password || !phone || !vehicleNumber) {
      return res.status(400).json({ success: false, message: 'Sabhi fields required hain!' });
    }

    const existing = await Driver.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Driver already registered hai!' });
    }

    const driver = new Driver({ name, email, password, phone, vehicleNumber, vehicleType });
    await driver.save();

    res.status(201).json({ success: true, message: '✅ Driver registered!', driver: { ...driver.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET ALL DRIVERS — GET /api/drivers
// ===========================
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.json({ success: true, count: drivers.length, drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET AVAILABLE DRIVERS — GET /api/drivers/available
// ===========================
const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ isAvailable: true }).select('-password');
    res.json({ success: true, count: drivers.length, drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET SINGLE DRIVER — GET /api/drivers/:id
// ===========================
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).select('-password');
    if (!driver) return res.status(404).json({ success: false, message: 'Driver nahi mila!' });
    res.json({ success: true, driver });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = { registerDriver, getAllDrivers, getAvailableDrivers, getDriverById };
