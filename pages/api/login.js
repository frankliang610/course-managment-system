import axios from 'axios';
import { API_URL } from './apiUrl';

const login = async (data, userType) => {
  const loginUrl = `${API_URL}/login/${userType}`;

  const loginResponse = await axios
    .post(loginUrl, {
      email: data.email,
      password: data.password,
    })
    .then((response) => response)
    .catch((error) => error.response); // The error handling response was designed by axios like so. https://github.com/axios/axios/issues/376
  return loginResponse;
};

export default login;
