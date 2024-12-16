const Note = require('./note');

Note.sync(); // Ensures the model matches the database schema

module.exports = { Note };
