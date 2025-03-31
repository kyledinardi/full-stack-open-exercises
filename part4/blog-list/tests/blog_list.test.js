const { test, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const testBlogs = require('./testBlogs');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(testBlogs);
});

test('correct number of blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, testBlogs.length);
});

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs');
  assert.ok(response.body[0].id);
  assert.strictEqual(response.body[0]._id, undefined);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const lastBlog = response.body[response.body.length - 1];
  assert.strictEqual(response.body.length, testBlogs.length + 1);
  assert.deepStrictEqual(lastBlog, { ...newBlog, id: lastBlog.id });
});

test('if the title property is missing from the request, the server returns a 400 status code', async () => {
  const newBlog = {
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
});

after(() => {
  mongoose.connection.close();
});
