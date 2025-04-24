import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { createBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    dispatch(createBlog({ title, author, url }));
    dispatch(setNotification(`a new blog ${title} by ${author} added`));

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div className='blogForm'>
      <h2>create new</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label htmlFor='title'>title</Form.Label>
          <Form.Control
            type='text'
            value={title}
            name='title'
            id='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='author'>author</Form.Label>
          <Form.Control
            type='text'
            value={author}
            name='author'
            id='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='url'>url</Form.Label>
          <Form.Control
            type='text'
            value={url}
            name='url'
            id='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Button type='submit'>create</Button>
      </Form>
    </div>
  );
};

export default BlogForm;
