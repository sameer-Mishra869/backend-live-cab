const mongoose = require('mongoose');
require('dotenv').config();

const City = require('./models/City');
const Driver = require('./models/Driver');

const cities = [
  { name: 'Mumbai', baseRate: 50, perKmRate: 15 },
  { name: 'Delhi', baseRate: 40, perKmRate: 12 },
  { name: 'Bangalore', baseRate: 60, perKmRate: 16 },
  { name: 'Pune', baseRate: 45, perKmRate: 14 },
  { name: 'Hyderabad', baseRate: 50, perKmRate: 15 },
  { name: 'Chennai', baseRate: 45, perKmRate: 13 },
  { name: 'Kolkata', baseRate: 40, perKmRate: 12 },
  { name: 'Ahmedabad', baseRate: 45, perKmRate: 13 },
  { name: 'Jaipur', baseRate: 40, perKmRate: 12 },
  { name: 'Chandigarh', baseRate: 40, perKmRate: 12 }
];

const drivers = [
  { name: 'Ramesh Kumar', email: 'ramesh@driver.com', password: 'password123', phone: '9876543210', vehicleNumber: 'MH01AB1234', vehicleType: 'sedan' },
  { name: 'Suresh Sharma', email: 'suresh@driver.com', password: 'password123', phone: '9876543211', vehicleNumber: 'DL01CD5678', vehicleType: 'suv' },
  { name: 'Vijay Singh', email: 'vijay@driver.com', password: 'password123', phone: '9876543212', vehicleNumber: 'KA01EF9012', vehicleType: 'auto' },
  { name: 'Amit Verma', email: 'amit@driver.com', password: 'password123', phone: '9876543213', vehicleNumber: 'MH12GH3456', vehicleType: 'sedan' },
  { name: 'Rajesh Gupta', email: 'rajesh@driver.com', password: 'password123', phone: '9876543214', vehicleNumber: 'MH02JK7890', vehicleType: 'suv' },
  { name: 'Sunil Yadav', email: 'sunil@driver.com', password: 'password123', phone: '9876543215', vehicleNumber: 'DL04LM1122', vehicleType: 'auto' },
  { name: 'Deepak Patel', email: 'deepak@driver.com', password: 'password123', phone: '9876543216', vehicleNumber: 'GJ01NP3344', vehicleType: 'bike' },
  { name: 'Manoj Joshi', email: 'manoj@driver.com', password: 'password123', phone: '9876543217', vehicleNumber: 'MH14QR5566', vehicleType: 'sedan' },
  { name: 'Prakash Rao', email: 'prakash@driver.com', password: 'password123', phone: '9876543218', vehicleNumber: 'TS07ST7788', vehicleType: 'suv' },
  { name: 'Anil Deshmukh', email: 'anil@driver.com', password: 'password123', phone: '9876543219', vehicleNumber: 'MH12UV9900', vehicleType: 'auto' },
  { name: 'Vickram Reddi', email: 'vickram@driver.com', password: 'password123', phone: '9876543220', vehicleNumber: 'KA03WX1133', vehicleType: 'bike' },
  { name: 'Sanjay Dutt', email: 'sanjay@driver.com', password: 'password123', phone: '9876543221', vehicleNumber: 'MH03YZ5577', vehicleType: 'sedan' }
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    for (const city of cities) {
      await City.updateOne(
        { name: city.name },
        { $set: city },
        { upsert: true }
      );
    }
    console.log('✅ Cities seeded successfully!');

    for (const driver of drivers) {
      const existing = await Driver.findOne({ email: driver.email });
      if (!existing) {
        const d = new Driver(driver);
        await d.save();
      }
    }
    console.log('✅ Drivers seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedData();
