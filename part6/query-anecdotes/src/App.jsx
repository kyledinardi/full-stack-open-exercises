import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationDispatch } from './NotificationContext';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { getAll, vote } from './services/anecdoteService';

const App = () => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: vote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);

      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((a) => (a.id !== newAnecdote.id ? a : newAnecdote)),
      );
    },
  });

  const handleVote = (anecdote) => {
    newAnecdoteMutation.mutate(anecdote);
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);

    dispatch({
      type: 'SET_NOTIFICATION',
      payload: `anecdote '${anecdote.content} voted'`,
    });
  };

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    console.log(result.error);
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
