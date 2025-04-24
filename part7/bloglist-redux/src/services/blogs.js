import axios from 'axios';
import { token } from '../token';

const baseUrl = '/api/blogs';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const like = async (blog) => {
  const { user, likes, id } = blog;
  const newBlog = { ...blog, user: user.id, likes: likes + 1, id: undefined };
  const response = await axios.put(`${baseUrl}/${id}`, newBlog);
  return response.data;
};

const remove = async (id) => {
  const config = { headers: { Authorization: token } };
  await axios.delete(`${baseUrl}/${id}`, config);
};

const addComment = async (id, text) => {
  const config = { headers: { Authorization: token } };

  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    { text },
    config,
  );

  return response.data;
};

export default { getAll, create, like, remove, addComment };
