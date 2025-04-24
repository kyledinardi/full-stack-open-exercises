let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

export { token, setToken };
