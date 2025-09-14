const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const { isValidPassword } = require('../utils/validators');

// signup
router.post('/signup',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min:8 }),
  async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    if(!isValidPassword(password)) return res.status(400).json({ msg: 'Password strength invalid: min 8 chars, 1 number, 1 special char' });

    try {
      let user = await User.findOne({ email });
      if(user) return res.status(400).json({ msg: 'Email already registered' });
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user = new User({ name, email, password: hash });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' });
      res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } });
    } catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
  });

// login
router.post('/login', body('email').isEmail(), body('password').notEmpty(), async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ msg: 'Invalid credentials' });
    if(user.isBlocked) return res.status(403).json({ msg: 'Account blocked' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || '7d' });
    res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } });
  } catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

// change password (auth required)
const { auth } = require('../middleware/auth');
router.post('/change-password', auth, async (req,res)=>{
  const { currentPassword, newPassword } = req.body;
  if(!currentPassword || !newPassword) return res.status(400).json({ msg: 'Missing fields' });
  if(!isValidPassword(newPassword)) return res.status(400).json({ msg: 'New password does not meet strength requirements' });
  try {
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if(!match) return res.status(400).json({ msg: 'Current password incorrect' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ msg: 'Password changed' });
  } catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
});

module.exports = router;
