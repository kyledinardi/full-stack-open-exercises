import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Blog from './components/Blog';
import blogService from './services/blogs';
import login from './services/login';
import ToggleAble from './components/Toggleable';
import BlogForm from './components/BlogForm';
import {
  useUserDispatch,
  useUserValue,
  useNotificationDispatch,
  useNotificationValue,
} from './contexts';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const userDispatch = useUserDispatch();
  const notificationDispatch = useNotificationDispatch();
  const user = useUserValue();
  const { message, isError } = useNotificationValue();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      userDispatch({ type: 'SET_USER', payload: user });
    }
  }, [userDispatch]);

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    console.error(result.error);
    return <div>blog service not available due to problems in server</div>;
  }

  const blogs = result.data;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({ type: 'SET_USER', payload: user });
      setUsername('');
      setPassword('');
    } catch (exception) {
      setTimeout(
        () => notificationDispatch({ type: 'CLEAR_NOTIFICATION' }),
        5000,
      );

      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: { message: 'wrong username or password', isError: true },
      });
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor='username'>username</label>
            <input
              type='text'
              value={username}
              name='Username'
              id='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor='password'>password</label>
            <input
              type='password'
              value={password}
              name='Password'
              id='password'
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
      <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>
      <p>
        {user.name} logged in
        <button
          onClick={() => {
            userDispatch({ type: 'logout' });
            localStorage.clear();
          }}
        >
          logout
        </button>
      </p>
      <ToggleAble buttonLabel='new blog'>
        <BlogForm />
      </ToggleAble>
      {blogs
        .sort((b1, b2) => b2.likes - b1.likes)

        .map((blog) => (
          <Blog key={blog.id} blog={blog} username={user.username} />
        ))}
    </div>
  );
};

export default App;
