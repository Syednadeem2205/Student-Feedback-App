// createAdmin.js - Create first admin for Student Feedback App

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Load environment variables
dotenv.config();

// Load your User model (adjust path if needed)
const User = require('./models/User'); // Make sure User model exists

// Admin details
const adminData = {
  name: "Admin",
  email: "admin@studentfeedback.com",
  password: "Admin@123", // You can change this
  role: "admin"
};

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
