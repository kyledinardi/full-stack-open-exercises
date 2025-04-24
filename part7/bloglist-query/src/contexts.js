import { createContext, useContext } from 'react';

const UserContext = createContext();
const NotificationContext = createContext();

const useUserValue = () => useContext(UserContext)[0];
const useUserDispatch = () => useContext(UserContext)[1];
const useNotificationValue = () => useContext(NotificationContext)[0];
const useNotificationDispatch = () => useContext(NotificationContext)[1];

export {
  UserContext,
  NotificationContext,
  useUserValue,
  useUserDispatch,
  useNotificationValue,
  useNotificationDispatch,
};
