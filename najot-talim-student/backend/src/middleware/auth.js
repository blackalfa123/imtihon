const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/jwt');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Avval login qiling.' });
    req.userId = jwt.verify(token, JWT_SECRET).userId;
    next();
  } catch {
    res.status(401).json({ message: 'Token yaroqsiz.' });
  }
};
