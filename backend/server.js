// Import necessary packages
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- CORS ---
app.use(cors({
  origin: [
    "https://studentfeedbackappv1-34f0891g2-syed-nadeem-ahmeds-projects.vercel.app", // your frontend (Vercel)
    "http://localhost:5173" // optional, for local dev
  ],
  credentials: true
}));

// --- Middleware ---
// Security headers
app.use(helmet());

// Body parser
app.use(express.json({ limit: '5mb' }));

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
});
app.use('/api/auth', authLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
connectDB();

// --- Routes ---
app.use('/api/courses', require('./routes/courses'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/admin', require('./routes/admin'));

// --- Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server error' });
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
