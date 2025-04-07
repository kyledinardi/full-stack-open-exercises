import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const likeMockHandler = vi.fn();

describe('< Blog />', () => {
  beforeEach(() => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: { username: 'test', name: 'test' },
    };

    render(
      <Blog
        blog={blog}
        username='test'
        like={likeMockHandler}
        removeBlog={() => {}}
      />,
    );
  });

  test('renders title and author but not url or likes by default', () => {
    expect(screen.getByText('React patterns Michael Chan')).toBeDefined();
    expect(screen.queryByText('https://reactpatterns.com/')).toBeNull();
    expect(screen.queryByText('likes 7')).toBeNull();
  });

  describe('when view button is clicked', () => {
    let user;

    beforeEach(async () => {
      user = userEvent.setup();
      const button = screen.getByText('view');
      await user.click(button);
    });

    test('url and likes are shown when button is clicked', async () => {
      expect(screen.getByText('https://reactpatterns.com/')).toBeDefined();
      expect(screen.getByText('likes 7')).toBeDefined();
    });

    test('like button is clicked twice', async () => {
      const likeButton = screen.getByText('like');
      await user.click(likeButton);
      await user.click(likeButton);
      expect(likeMockHandler.mock.calls).toHaveLength(2);
    });
  });
});
