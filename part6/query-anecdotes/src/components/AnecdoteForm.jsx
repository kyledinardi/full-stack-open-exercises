import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationDispatch } from '../NotificationContext';
import { createNew } from '../services/anecdoteService';

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,

    onError: (error) =>
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: error.response.data.error,
      }),

    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote));
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';

    newAnecdoteMutation.mutate(content);
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    if (newAnecdoteMutation.isError) return;

    dispatch({
      type: 'SET_NOTIFICATION',
      payload: `anecdote '${content} created'`,
    });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
