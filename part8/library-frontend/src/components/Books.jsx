import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ALL_BOOKS_IN_GENRE } from '../queries';
import { useEffect, useState } from 'react';

const Books = (props) => {
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState('');
  let query = ALL_BOOKS;
  let options;

  if (genre !== '') {
    query = ALL_BOOKS_IN_GENRE;
    options = { variables: { genre } };
  }

  const books = useQuery(query, options);

  useEffect(() => {
    if (genre === '' && books.data) {
      const genreSet = new Set();

      books.data.allBooks.forEach((book) => {
        book.genres.forEach((genre) => genreSet.add(genre));
      });

      setGenres(Array.from(genreSet));
    }
  }, [genre, books.data]);

  if (!props.show) {
    return null;
  }

  if (books.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>
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
      {genres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre('')}>all genres</button>
    </div>
  );
};

Books.propTypes = { show: PropTypes.bool };
export default Books;
