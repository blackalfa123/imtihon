const path = require('path');
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const dbReady = require('./middleware/dbReady');
const app = express();

app.use(cors());
app.use(express.json());

// Frontend shu backend serveridan xizmat qilinadi.
app.use(express.static(path.resolve(__dirname, '../../frontend')));

app.get('/api', (req, res) => res.json({ message: 'Najot Talim API ishlayapti' }));
app.get('/api/health', (req, res) => res.json({ ok: true, db: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api', (req, res, next) => (req.path === '/' || req.path === '/health' ? next() : dbReady(req, res, next)));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', auth, require('./routes/user.routes'));
app.use('/api/todos', auth, require('./routes/todo.routes'));
app.use('/api/posts', auth, require('./routes/post.routes'));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.resolve(__dirname, '../../frontend/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.code === 11000 ? 409 : 400).json({
    message: err.code === 11000 ? 'Email band.' : err.message || 'Server xatosi.'
  });
});

module.exports = app;
