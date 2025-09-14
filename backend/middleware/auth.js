// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming your User model is here
const dotenv = require("dotenv");

dotenv.config();

// Middleware to verify a user's JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to check if the user has a specific role
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ msg: "Access denied" });
    }
  };
};

module.exports = { auth, requireRole };
