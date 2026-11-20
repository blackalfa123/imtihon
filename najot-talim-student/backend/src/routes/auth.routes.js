const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = require('../config/jwt');
const asyncHandler = require('../utils/asyncHandler');

const makeToken = id => jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '7d' });
const publicUser = user => ({ id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone });

router.post('/register', asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (![firstname, lastname, email, password].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ message: 'Ism, familiya, email va parol majburiy.' });
  }
  if (password.length < 6) return res.status(400).json({ message: 'Parol kamida 6 ta belgidan iborat bo‘lsin.' });
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ message: 'Email formati noto‘g‘ri.' });
  if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'Bu email allaqachon ro‘yxatdan o‘tgan.' });
  const user = await User.create({ firstname: firstname.trim(), lastname: lastname.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: makeToken(user._id), user: publicUser(user) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!email || !password) return res.status(400).json({ message: 'Email va parol majburiy.' });
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Email yoki parol noto‘g‘ri.' });
  res.json({ token: makeToken(user._id), user: publicUser(user) });
}));

router.get('/me', require('../middleware/auth'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi.' });
  res.json(publicUser(user));
}));
module.exports = router;
