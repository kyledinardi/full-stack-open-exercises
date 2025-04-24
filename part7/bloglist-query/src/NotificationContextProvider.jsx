import { useReducer } from 'react';
import { NotificationContext } from './contexts';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload;

    case 'CLEAR_NOTIFICATION':
      return { ...state, message: '' };

    default:
      return state;
  }
};

const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: '',
    isError: false,
  });

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
