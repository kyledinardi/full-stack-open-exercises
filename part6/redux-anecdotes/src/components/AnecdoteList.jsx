import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector(({ filters, anecdotes }) => {
    if (filters === '') {
      return anecdotes;
    }

    return anecdotes.filter((a) => a.content.includes(filters));
  });

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5));
  };

  return [...anecdotes]
    .sort((a, b) => b.votes - a.votes)

    .map((anecdote) => (
      <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
    ));
};

export default AnecdoteList;
