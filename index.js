const express = require('express');
const { connectToDatabase } = require('./util/db');
const { PORT } = require('./util/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout'); // Added logout router
const sessionValidator = require('./middleware/sessionValidator'); // Middleware for session validation
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

// Apply session validation middleware to all routes that require authentication
app.use(sessionValidator);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter); // New logout route

// Error handling middleware
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
