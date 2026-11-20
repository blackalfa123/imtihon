const app = require('./app');
const connectDatabase = require('./config/database');

const PORT = process.env.PORT || 3000;

// Server avval ishga tushadi (frontend ochiladi). Baza ulanmaguncha API 503 qaytaradi (app.js).
app.listen(PORT, () => {
  console.log(`Najot Talim: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});

connectDatabase().catch((error) => {
  console.error('MongoDB ulanish xatosi:', error.message);
});
