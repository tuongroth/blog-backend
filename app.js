const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'my_database',
  password: 'new_password',  // Update with the correct password
  port: 5432,
});

// Middleware to parse JSON request bodies
app.use(express.json());

// GET all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving blogs');
  }
});

// POST new blog
app.post('/api/blogs', async (req, res) => {
  const { author, title, url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO blogs (author, title, url) VALUES ($1, $2, $3) RETURNING *',
      [author, title, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding blog');
  }
});

// DELETE a blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Blog not found');
    }
    res.status(200).send('Blog deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting blog');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
