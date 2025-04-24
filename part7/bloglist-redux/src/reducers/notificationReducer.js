import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', isError: false },

  reducers: {
    setNotification(state, action) {
      return action.payload;
    },

    clearNotification(state) {
      return { ...state, message: '' };
    },
  },
});

const { actions } = notificationSlice;
let timeout;

export const setNotification =
  (message, isError = false) =>
    async (dispatch) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      dispatch(actions.setNotification({ message, isError }));
      timeout = setTimeout(() => dispatch(actions.clearNotification()), 5000);
    };

export default notificationSlice.reducer;
