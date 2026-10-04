const mongoose = require('mongoose');

// City schema — har city ka base rate aur per km rate
const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      unique: true,
      trim: true,
    },
    baseRate: {
      type: Number,
      required: [true, 'Base rate is required'],
      min: [0, 'Base rate cannot be negative'],
    },
    perKmRate: {
      type: Number,
      required: [true, 'Per KM rate is required'],
      min: [0, 'Per KM rate cannot be negative'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('City', citySchema);
