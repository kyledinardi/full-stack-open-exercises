import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationDispatch } from '../contexts';
import blogService from '../services/blogs';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,

    onError: (error) => {
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);

      dispatch({
        type: 'SET_NOTIFICATION',
        payload: { message: error.response.data.error, isError: true },
      });
    },

    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(['blogs'], [...blogs, newBlog]);
    },
  });

  const addBlog = async (event) => {
    event.preventDefault();
    newBlogMutation.mutate({ title, author, url });
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);

    dispatch({
      type: 'SET_NOTIFICATION',
      payload: {
        message: `a new blog ${title} by ${author} added`,
        isError: false,
      },
    });

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div className='blogForm'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor='title'>title</label>
          <input
            type='text'
            value={title}
            name='title'
            id='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <label htmlFor='author'>author</label>
          <input
            type='text'
            value={author}
            name='author'
            id='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <label htmlFor='url'>url</label>
          <input
            type='text'
            value={url}
            name='url'
            id='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default BlogForm;
