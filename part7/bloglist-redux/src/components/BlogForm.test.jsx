import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  test('calls the event handler with the right details', async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<BlogForm createBlog={createBlog} />);

    const titleInput = container.querySelector('#title');
    const authorInput = container.querySelector('#author');
    const urlInput = container.querySelector('#url');
    const createButton = screen.getByText('create');

    await user.type(titleInput, 'React patterns');
    await user.type(authorInput, 'Michael Chan');
    await user.type(urlInput, 'https://reactpatterns.com/');
    await user.click(createButton);
    expect(createBlog.mock.calls).toHaveLength(1);

    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    });
  });
});
