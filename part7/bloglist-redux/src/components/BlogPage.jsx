import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { setNotification } from '../reducers/notificationReducer';
import {
  commentBlog,
  initializeBlogs,
  likeBlog,
  removeBlog,
} from '../reducers/blogReducer';

const BlogPage = () => {
  const [commentText, setCommentText] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const blog = useSelector(({ blogs }) => blogs.find((b) => b.id === id));
  const currentUser = useSelector(({ users }) => users.currentUser);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const like = () => dispatch(likeBlog(blog));

  const remove = () => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id));
      dispatch(setNotification(`blog ${blog.title} by ${blog.author} removed`));
      navigate('/');
    }
  };

  const addComment = (event) => {
    event.preventDefault();
    dispatch(commentBlog(blog, commentText));
    dispatch(setNotification(`comment ${commentText} added to ${blog.title}`));
    setCommentText('');
  };

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        <button onClick={() => like(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {currentUser.username === blog.user.username && (
        <button onClick={() => remove(blog)}>remove</button>
      )}
      <div>
        <h3>comments</h3>
        <Form onSubmit={addComment}>
          <Form.Control
            type='text'
            value={commentText}
            name='comment'
            id='comment'
            onChange={({ target }) => setCommentText(target.value)}
          />
          <Button type='submit'>add comment</Button>
        </Form>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BlogPage;
