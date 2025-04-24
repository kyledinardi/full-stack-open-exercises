import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUsers } from '../reducers/userReducer';
import { useParams } from 'react-router-dom';

const User = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const user = useSelector(({ users }) =>
    users.allUsers.find((u) => u.id === id),
  );

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
