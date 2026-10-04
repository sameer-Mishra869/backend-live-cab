const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ========================
// MIDDLEWARE
// ========================
app.use(cors());
app.use(express.json());

// ========================
// ROUTES
// ========================
const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const driverRoutes = require('./routes/driverRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const fareRoutes = require('./routes/fareRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/fare', fareRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({ message: '🚖 Cab Booking API is running!' });
});

// ========================
// MONGODB CONNECTION
// ========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connected Successfully!');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server is running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
