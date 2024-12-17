const router = require('express').Router();
const { Blog, User } = require('../models');
const { Op } = require('sequelize');
const authenticateUser = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { search } = req.query;
  const where = {};

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const blogs = await Blog.findAll({
    where,
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name'],
    },
    order: [['likes', 'DESC']],
  });

  res.json(blogs);
});

router.post('/', authenticateUser, async (req, res, next) => {
  try {
    const { title, author, content, likes } = req.body;
    const blog = await Blog.create({
      title,
      author,
      content,
      likes,
      userId: req.user.id,
    });
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (blog.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this blog' });
    }
    await blog.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
