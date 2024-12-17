const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
require('express-async-errors');

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fullstack:2r6FcH9cLQRdnXHJ@cluster0.xgr0xci.mongodb.net/mydatabase?retryWrites=true&w=majority';

// Initialize Express App
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Blog Schema and Model
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: String,
    url: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Blog = mongoose.model('Blog', blogSchema);

// User Schema and Model
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

// Blog Routes
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

app.post('/api/blogs', async (req, res) => {
  try {
    const { title, author, url, likes } = req.body;
    const blog = new Blog({ title, author, url, likes });
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { likes } = req.body;
    if (typeof likes !== 'number') {
      return res.status(400).json({ error: 'Likes must be a number' });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  await blog.deleteOne();
  res.status(204).end();
});

// User Routes
app.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, username } = req.body;
    if (!name || !username) {
      return res.status(400).json({ error: 'Name and username are required' });
    }

    const user = new User({ name, username });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  const { newUsername } = req.body;

  if (!newUsername) {
    return res.status(400).json({ error: 'New username is required' });
  }

  const user = await User.findOneAndUpdate(
    { username },
    { username: newUsername },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: 'Something went wrong' });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
