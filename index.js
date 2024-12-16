require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Environment Variables
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true, // Unified topology is now the default.
    });
    console.log('connected to MongoDB');
  } catch (err) {
    console.error('failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

// Define the Note schema and model
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  important: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model('Note', noteSchema);

// Middleware to Find a Note by ID
const noteFinder = async (req, res, next) => {
  try {
    req.note = await Note.findById(req.params.id);
    next();
  } catch (error) {
    res.status(400).json({ error: 'malformatted id' });
  }
};

// Routes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  try {
    const note = new Note(req.body);
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/notes/:id', noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

app.put('/api/notes/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important;
    req.note.content = req.body.content || req.note.content;
    const updatedNote = await req.note.save();
    res.json(updatedNote);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/notes/:id', noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.remove();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

// Start the Server
const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

