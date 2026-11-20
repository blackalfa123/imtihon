const router = require('express').Router();
const Todo = require('../models/Todo');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(async (req, res) => res.json(await Todo.find({ user: req.userId }).sort({ createdAt: -1 }))));
router.post('/', asyncHandler(async (req, res) => {
  const { title, description, isCompleted } = req.body;
  if (typeof title !== 'string' || !title.trim() || typeof description !== 'string' || !description.trim() || typeof isCompleted !== 'boolean') {
    return res.status(400).json({ message: 'Sarlavha, tavsif va bajarilganlik holati majburiy.' });
  }
  const todo = await Todo.create({ title: title.trim(), description: description.trim(), isCompleted, user: req.userId });
  res.status(201).json(todo);
}));
router.patch('/:id', asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true });
  if (!todo) return res.status(404).json({ message: 'Todo topilmadi.' });
  res.json(todo);
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!todo) return res.status(404).json({ message: 'Todo topilmadi.' });
  res.json({ message: 'Todo o‘chirildi.' });
}));
module.exports = router;
