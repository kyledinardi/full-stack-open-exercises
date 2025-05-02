import { useEffect, useState } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommended from './components/Recommended';
import Login from './components/Login';
import { ALL_BOOKS, BOOK_ADDED } from './queries';

const App = () => {
  const [page, setPage] = useState('authors');
  const [currentUser, setCurrentUser] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('library-user'));

    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => ({
        allBooks: allBooks.concat(addedBook),
      }));

      alert(`New book added: ${addedBook.title}`);
    },
  });

  const logout = () => {
    setCurrentUser(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {currentUser ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      {currentUser && (
        <Recommended
          show={page === 'recommended'}
          favoriteGenre={currentUser.favoriteGenre}
        />
      )}
      <Login
        show={page === 'login'}
        setPage={setPage}
        setCurrentUser={setCurrentUser}
      />
    </div>
  );
};

export default App;
