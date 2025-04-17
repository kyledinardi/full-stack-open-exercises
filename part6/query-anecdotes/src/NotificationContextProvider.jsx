import { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { NotificationContext } from './NotificationContext';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload;

    case 'CLEAR_NOTIFICATION':
      return '';

    default:
      return state;
  }
};

const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    '',
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationContextProvider.propTypes = { children: PropTypes.node.isRequired };
export default NotificationContextProvider;
