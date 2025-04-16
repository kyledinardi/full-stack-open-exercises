import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',

  reducers: {
    setNotification(state, action) {
      return action.payload;
    },

    clearNotification() {
      return '';
    },
  },
});

const { actions } = notificationSlice;
let notificationTimeout;

export const setNotification = (notification, seconds) => async (dispatch) => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  dispatch(actions.setNotification(notification));

  notificationTimeout = setTimeout(
    () => dispatch(actions.clearNotification()),
    seconds * 1000,
  );
};

export default notificationSlice.reducer;
