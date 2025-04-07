import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import login from './services/login';
import ToggleAble from './components/Toggleable';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }

    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setIsErrorMessage(true);
      setMessage('wrong username or password');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      setIsErrorMessage(false);
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTimeout(() => setMessage(null), 5000);
    } catch (exception) {
      console.error(exception);
      setIsErrorMessage(true);
      setMessage('something went wrong');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const like = async (blog) => {
    try {
      const newBlog = await blogService.like(blog);
      setBlogs(blogs.map((b) => (b.id === blog.id ? newBlog : b)));
    } catch (exception) {
      console.error(exception);
      setIsErrorMessage(true);
      setMessage('something went wrong');
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const deleteBlog = async (blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        setIsErrorMessage(false);
        setMessage(`blog ${blog.title} by ${blog.author} removed`);
        setTimeout(() => setMessage(null), 5000);
      } catch (exception) {
        console.error(exception);
        setIsErrorMessage(true);
        setMessage('something went wrong');
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <p style={{ color: isErrorMessage ? 'red' : 'green' }}>{message}</p>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p style={{ color: isErrorMessage ? 'red' : 'green' }}>{message}</p>
      <p>
        {user.name} logged in
        <button
          onClick={() => {
            setUser(null);
            localStorage.clear();
          }}
        >
          logout
        </button>
      </p>
      <ToggleAble buttonLabel='new blog'>
        <BlogForm createBlog={addBlog} />
      </ToggleAble>
      {blogs
        .sort((b1, b2) => b2.likes - b1.likes)

        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            username={user.username}
            like={like}
            removeBlog={deleteBlog}
          />
        ))}
    </div>
  );
};

export default App;
