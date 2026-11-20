const mongoose = require('mongoose');

// Baza ulanmagan bo'lsa Login/Register va boshqa so'rovlarga aniq 503 javob beramiz.
module.exports = (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  res.status(503).json({ message: 'Ma’lumotlar bazasiga ulanilmagan. Server terminalidagi MongoDB xatosini tekshiring.' });
};
