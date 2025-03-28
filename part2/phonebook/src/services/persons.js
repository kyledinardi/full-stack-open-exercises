import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);

  return request
    .then((response) => response.data)

    .catch((error) => {
      throw error;
    });
};

const update = (newPerson) => {
  const request = axios.put(`${baseUrl}/${newPerson.id}`, newPerson);
  return request
    .then((response) => response.data)

    .catch((error) => {
      throw error;
    });
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, create, update, remove };
