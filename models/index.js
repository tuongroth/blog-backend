const express = require('express');
const { User, Blog, ReadingList } = require('./models'); // Import models
const router = express.Router();

// POST /api/readinglists - Add a blog to the reading list
router.post('/api/readinglists', async (req, res) => {
  const { blogId, userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);

    if (!user || !blog) {
      return res.status(400).json({ error: 'User or Blog not found' });
    }

    // Check if the blog is already in the reading list
    const existingReadingList = await ReadingList.findOne({
      where: { user_id: userId, blog_id: blogId },
    });

    if (existingReadingList) {
      return res.status(400).json({ error: 'Blog is already in the reading list' });
    }

    // Add blog to reading list
    const readingListEntry = await ReadingList.create({
      user_id: userId,
      blog_id: blogId,
    });

    res.status(201).json({
      message: 'Blog added to reading list',
      readingListEntry,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the blog to the reading list' });
  }
});

// GET /api/users/:id - Return user with reading list
router.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: {
        model: Blog,
        as: 'readingList',
        through: { attributes: ['is_read'] },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch all blogs in the reading list
    const readingList = await ReadingList.findAll({
      where: { user_id: id },
      include: {
        model: Blog,
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
      },
    });

    res.json({
      name: user.name,
      username: user.username,
      readings: readingList.map(entry => entry.blog),
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user information' });
  }
});

module.exports = router;
