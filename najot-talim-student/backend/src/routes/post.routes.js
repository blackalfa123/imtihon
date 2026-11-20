const router = require('express').Router();
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
router.get('/', asyncHandler(async (req, res) => res.json(await Post.find({ user: req.userId }).sort({ createdAt: -1 }))));
router.post('/', asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (typeof title !== 'string' || !title.trim() || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Post sarlavhasi va matni majburiy.' });
  }
  res.status(201).json(await Post.create({ title: title.trim(), content: content.trim(), user: req.userId }));
}));
module.exports = router;
