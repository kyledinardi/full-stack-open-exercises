import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],

  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },

    addBlog(state, action) {
      return state.concat(action.payload);
    },

    updateBlog(state, action) {
      return state.map((b) =>
        b.id === action.payload.id ? action.payload : b,
      );
    },

    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload);
    },
  },
});

const { actions } = blogSlice;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(actions.setBlogs(blogs));
  };
};

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject);
    dispatch(actions.addBlog(newBlog));
  };
};

export const likeBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.like(blogObject);
    dispatch(actions.updateBlog(newBlog));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(actions.removeBlog(id));
  };
};

export const commentBlog = (blog, text) => {
  return async (dispatch) => {
    const newComment = await blogService.addComment(blog.id, text);
    const newBlog = { ...blog, comments: blog.comments.concat(newComment) };
    dispatch(actions.updateBlog(newBlog));
  };
};

export default blogSlice.reducer;
