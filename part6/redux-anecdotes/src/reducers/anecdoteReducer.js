import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],

  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },

    voteForAnecdote(state, action) {
      const id = action.payload;
      const anecdoteToVote = state.find((a) => a.id === id);

      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      };

      return state.map((a) => (a.id !== id ? a : votedAnecdote));
    },

    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

const { actions } = anecdoteSlice;

export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll();
  dispatch(actions.setAnecdotes(anecdotes));
};

export const createAnecdote = (content) => async (dispatch) => {
  const newAnecdote = await anecdoteService.createNew(content);
  dispatch(actions.appendAnecdote(newAnecdote));
};

export const voteAnecdote = (anecdote) => async (dispatch) => {
  await anecdoteService.vote(anecdote);
  dispatch(actions.voteForAnecdote(anecdote.id));
};

export default anecdoteSlice.reducer;
