const City = require('../models/City');

// ===========================
// FARE ESTIMATE — POST /api/fare/estimate
// ===========================
const estimateFare = async (req, res) => {
  try {
    const { cityId, distanceKm } = req.body;

    if (!cityId || !distanceKm) {
      return res.status(400).json({
        success: false,
        message: 'cityId aur distanceKm dono required hain!',
      });
    }

    if (distanceKm <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Distance 0 se zyada hona chahiye!',
      });
    }

    // City ka rate dhundo
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: '❌ City nahi mili!' });
    }

    // ================================
    // FARE FORMULA:
    // Total Fare = baseRate + (perKmRate × distanceKm)
    // ================================
    const estimatedFare = city.baseRate + city.perKmRate * distanceKm;

    res.status(200).json({
      success: true,
      message: '✅ Fare estimated successfully!',
      fareDetails: {
        city: city.name,
        distanceKm: Number(distanceKm),
        baseRate: city.baseRate,
        perKmRate: city.perKmRate,
        calculation: `₹${city.baseRate} + (₹${city.perKmRate} × ${distanceKm}km)`,
        estimatedFare: parseFloat(estimatedFare.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = { estimateFare };
