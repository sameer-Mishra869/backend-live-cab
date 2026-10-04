const City = require('../models/City');

// ===========================
// CREATE CITY — POST /api/cities  [Admin only]
// ===========================
const createCity = async (req, res) => {
  try {
    const { name, baseRate, perKmRate } = req.body;

    if (!name || baseRate === undefined || perKmRate === undefined) {
      return res.status(400).json({ success: false, message: 'name, baseRate, perKmRate sab required hain!' });
    }

    // Duplicate city check
    const existing = await City.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Yeh city already exist karti hai!' });
    }

    const city = new City({ name: name.trim(), baseRate, perKmRate });
    await city.save();

    res.status(201).json({ success: true, message: '✅ City added successfully!', city });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET ALL CITIES — GET /api/cities
// ===========================
const getAllCities = async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.json({ success: true, count: cities.length, cities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET SINGLE CITY — GET /api/cities/:id
// ===========================
const getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: 'City nahi mili!' });
    res.json({ success: true, city });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// UPDATE CITY RATES — PATCH /api/cities/:id/rates  [Admin only]
// ===========================
const updateCityRates = async (req, res) => {
  try {
    const { baseRate, perKmRate } = req.body;

    if (baseRate === undefined && perKmRate === undefined) {
      return res.status(400).json({ success: false, message: 'baseRate ya perKmRate mein se kuch toh do!' });
    }

    const updateData = {};
    if (baseRate !== undefined) updateData.baseRate = baseRate;
    if (perKmRate !== undefined) updateData.perKmRate = perKmRate;

    const city = await City.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Updated document return karo
      runValidators: true,
    });

    if (!city) return res.status(404).json({ success: false, message: 'City nahi mili!' });

    res.json({ success: true, message: '✅ City rates updated!', city });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// DELETE CITY — DELETE /api/cities/:id  [Admin only]
// ===========================
const deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: 'City nahi mili!' });
    res.json({ success: true, message: '✅ City deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = { createCity, getAllCities, getCityById, updateCityRates, deleteCity };
