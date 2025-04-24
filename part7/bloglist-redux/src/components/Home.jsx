import { useDispatch, useSelector } from 'react-redux';
import Blog from './Blog';
import BlogForm from './BlogForm';
import ToggleAble from './Toggleable';
import { useEffect } from 'react';
import { initializeBlogs } from '../reducers/blogReducer';

const Home = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(({ blogs }) => blogs);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  return (
    <div>
      <ToggleAble buttonLabel='create new'>
        <BlogForm />
      </ToggleAble>
      {[...blogs]
        .sort((b1, b2) => b2.likes - b1.likes)

        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default Home;
