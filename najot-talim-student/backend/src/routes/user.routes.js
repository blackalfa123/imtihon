const router = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

router.post('/', asyncHandler(async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  if (![firstname, lastname, email, phone].every(v => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ message: 'Ism, familiya, email va telefon majburiy.' });
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ message: 'Email formati noto‘g‘ri.' });
  const temporaryPassword = crypto.randomBytes(24).toString('hex');
  const user = await User.create({
    firstname: firstname.trim(), lastname: lastname.trim(), email: normalizedEmail,
    phone: phone.trim(), password: await bcrypt.hash(temporaryPassword, 10)
  });
  res.status(201).json({ id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone });
}));
module.exports = router;
