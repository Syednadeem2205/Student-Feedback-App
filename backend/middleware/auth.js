const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ msg: 'No token' });
  const token = header.split(' ')[1];
  if(!token) return res.status(401).json({ msg: 'No token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-password');
    if(!user) return res.status(401).json({ msg: 'Invalid token' });
    if(user.isBlocked) return res.status(403).json({ msg: 'Account blocked' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if(req.user.role !== role) return res.status(403).json({ msg: 'Forbidden' });
    next();
  };
}

module.exports = { auth, requireRole };
