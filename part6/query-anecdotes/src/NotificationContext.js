import { createContext, useContext } from 'react';

const NotificationContext = createContext();
const useNotificationValue = () => useContext(NotificationContext)[0];
const useNotificationDispatch = () => useContext(NotificationContext)[1];
export { NotificationContext, useNotificationValue, useNotificationDispatch };
