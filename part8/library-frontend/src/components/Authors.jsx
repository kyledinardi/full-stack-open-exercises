import { useMutation, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import { useState } from 'react';

const Authors = (props) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const authors = useQuery(ALL_AUTHORS);

  const [setBirthYear] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = (event) => {
    event.preventDefault();
    setBirthYear({ variables: { name, setBornTo: Number(born) } });
    setName('');
    setBorn('');
  };

  if (!props.show) {
    return null;
  }

  if (authors.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <select
            name='name'
            id='name'
            onChange={(e) => setName(e.target.value)}
          >
            <option value=''>Select author</option>
            {authors.data.allAuthors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='born'>born</label>
          <input
            type='number'
            name='born'
            id='born'
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button>update author</button>
      </form>
    </div>
  );
};

Authors.propTypes = { show: PropTypes.bool };
export default Authors;
