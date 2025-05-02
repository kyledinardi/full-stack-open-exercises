import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { LOGIN } from '../queries';

const Login = ({ show, setPage, setCurrentUser }) => {
  const [username, setUsername] = useState('111');
  const [password, setPassword] = useState('secret');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      error.cause.result.errors.forEach((gqlError) =>
        console.log(gqlError.message),
      );
    },
  });

  useEffect(() => {
    if (result.data) {
      const { user, token } = result.data.login;
      setCurrentUser(user);
      localStorage.setItem('library-user-token', token);
      localStorage.setItem('library-user', JSON.stringify(user));
    }
  }, [result.data, setCurrentUser]);

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
    setPage('authors');
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor='name'>username</label>
          <input
            type='text'
            id='name'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor='password'>password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  show: PropTypes.bool,
  setPage: PropTypes.func,
  setCurrentUser: PropTypes.func,
};

export default Login;
