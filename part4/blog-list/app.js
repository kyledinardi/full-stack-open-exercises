const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');
const loginRouter = require('./controllers/login');
const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
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
app.use(middleware.errorHandler);

module.exports = app;
