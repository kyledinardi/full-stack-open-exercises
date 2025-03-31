const express = require('express');
const cors = require('cors');
require('express-async-errors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');
const { MONGODB_URI } = require('./utils/config');

const app = express();
mongoose.connect(MONGODB_URI);
app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);

app.use((error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
});

module.exports = app;
