const blogsRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const { title, author, url, likes } = request.body;
  const user = await User.findById(request.user.id);
  const blog = new Blog({ title, author, url, likes, user: user.id });
  const savedBlog = await blog.save();
  const populatedBlog = await savedBlog.populate('user');

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(populatedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { params, body } = request;

  const updatedBlog = await Blog.findByIdAndUpdate(params.id, body, {
    new: true,
  }).populate('user');

  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(204).end();
  }

  if (blog.user.toString() !== request.user.id) {
    return response.status(403).json({ error: 'unauthorized' });
  }

  await Blog.findByIdAndDelete(blog.id);
  const user = await User.findById(blog.user);
  user.blogs = user.blogs.filter((b) => b.toString() !== blog.id);
  await user.save();
  response.status(204).end();
});

module.exports = blogsRouter;
