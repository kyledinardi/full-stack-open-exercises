import { useReducer } from 'react';
import { UserContext } from './contexts';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;

    case 'logout':
      return null;

    default:
      return state;
  }
};

const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
