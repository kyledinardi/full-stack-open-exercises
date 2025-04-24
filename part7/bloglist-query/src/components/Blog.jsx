import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useState } from 'react';
import blogService from '../services/blogs';
import { useNotificationDispatch } from '../contexts';

const Blog = ({ blog, username }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const likeMutation = useMutation({
    mutationFn: blogService.like,

    onSuccess: (likedBlog) => {
      const blogs = queryClient.getQueryData(['blogs']);

      queryClient.setQueriesData(
        ['blogs'],
        blogs.map((b) => (b.id === blog.id ? likedBlog : b)),
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: blogService.remove,

    onSuccess: () => {
      const blogs = queryClient.getQueryData(['blogs']);

      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((b) => b.id !== blog.id),
      );
    },
  });

  const remove = (blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      removeMutation.mutate(blog.id);
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);

      dispatch({
        type: 'SET_NOTIFICATION',
        payload: {
          message: `blog ${blog.title} by ${blog.author} removed`,
          isError: false,
        },
      });
    }
  };

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => likeMutation.mutate(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {username === blog.user.username && (
            <button onClick={() => remove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
};

export default Blog;
