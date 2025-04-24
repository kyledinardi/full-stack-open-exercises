import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';

const userSlice = createSlice({
  name: 'users',
  initialState: { currentUser: null, allUsers: [] },

  reducers: {
    setCurrentUser(state, action) {
      return { ...state, currentUser: action.payload };
    },

    setAllUsers(state, action) {
      return { ...state, allUsers: action.payload };
    },
  },
});

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch(userSlice.actions.setAllUsers(users));
  };
};

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
