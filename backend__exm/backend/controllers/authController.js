const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ===========================
// REGISTER — POST /api/auth/register
// ===========================
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email aur password required hain!',
      });
    }

    // Already registered check
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Yeh email already registered hai!',
      });
    }

    // Naya user banao
    const customer = new Customer({ name, email, password, phone, role });
    await customer.save();

    res.status(201).json({
      success: true,
      message: '✅ Registration successful! Ab login karo.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// LOGIN — POST /api/auth/login
// ===========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email aur password dono chahiye!' });
    }

    // User dhundo
    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: '❌ User nahi mila! Pehle register karo.' });
    }

    // Password compare karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: '❌ Wrong password!' });
    }

    // JWT Token banao — 24 ghante valid rahega
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: '✅ Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// ===========================
// GET PROFILE — GET /api/auth/me
// ===========================
const getProfile = async (req, res) => {
  try {
    const user = await Customer.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User nahi mila!' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = { register, login, getProfile };
