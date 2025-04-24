import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes } from 'react-router-dom';
import { setToken } from './token';
import login from './services/login';
import { setNotification } from './reducers/notificationReducer';
import { setCurrentUser } from './reducers/userReducer';
import Home from './components/Home';
import BlogPage from './components/BlogPage';
import Users from './components/Users';
import User from './components/User';
import { Alert, Button, Form, Nav, Navbar } from 'react-bootstrap';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const currentUser = useSelector(({ users }) => users.currentUser);
  const { message, isError } = useSelector(({ notification }) => notification);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setToken(user.token);
      dispatch(setCurrentUser(user));
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      setToken(user.token);
      dispatch(setCurrentUser(user));
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setNotification('wrong username or password', true));
    }
  };

  if (currentUser === null) {
    return (
      <div className='container'>
        <h2>Log in to application</h2>
        {message !== '' && (
          <Alert variant={isError ? 'danger' : 'success'}>{message}</Alert>
        )}
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label htmlFor='username'>username</Form.Label>
            <Form.Control
              type='text'
              value={username}
              name='Username'
              id='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor='password'>password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              name='Password'
              id='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </Form.Group>
          <Button type='submit'>login</Button>
        </Form>
      </div>
    );
  }

  return (
    <div className='container'>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link href='#' as='span'>
              <Link style={{ padding: 5 }} to='/'>
                blogs
              </Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <Link style={{ padding: 5 }} to='/users'>
                users
              </Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <em style={{ padding: 5 }}>{currentUser.name} logged in</em>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <button
                onClick={() => {
                  dispatch(setCurrentUser(null));
                  localStorage.clear();
                }}
              >
                logout
              </button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <h2>blogs</h2>
      {message !== '' && (
        <Alert variant={isError ? 'danger' : 'success'}>{message}</Alert>
      )}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blogs/:id' element={<BlogPage />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
