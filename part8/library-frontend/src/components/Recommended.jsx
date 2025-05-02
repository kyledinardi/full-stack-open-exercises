import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { ALL_BOOKS_IN_GENRE } from '../queries';

const Recommended = ({ show, favoriteGenre }) => {
  const books = useQuery(ALL_BOOKS_IN_GENRE, {
    variables: { genre: favoriteGenre },
  });

  if (!show) {
    return null;
  }

  if (books.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Recommended.propTypes = {
  show: PropTypes.bool,
  favoriteGenre: PropTypes.string,
};
export default Recommended;
