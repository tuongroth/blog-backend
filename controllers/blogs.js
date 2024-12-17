const router = require('express').Router();
const { Blog, User } = require('../models');
const { authenticateUser } = require('../middleware/auth'); // Token validation middleware

// GET all blogs with user details
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name'], // Include user info
    },
  });
  res.json(blogs);
});

// DELETE a blog (only by creator)
router.delete('/:id', authenticateUser, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  if (blog.userId !== req.user.id) { // Check ownership
    return res.status(403).json({ error: 'You do not have permission to delete this blog' });
  }

  await blog.destroy();
  res.status(204).end();
});
