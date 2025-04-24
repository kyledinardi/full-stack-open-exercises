const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const testingRouter = require('./controllers/testing');
const middleware = require('./utils/middleware');
const { MONGODB_URI } = require('./utils/config');

const app = express();
mongoose.connect(MONGODB_URI);
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', middleware.userExtractor, blogsRouter);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(middleware.errorHandler);
module.exports = app;
