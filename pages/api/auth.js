import axios from 'axios';
import { API_URL } from './apiUrl';
import formattedError from './formattedError';

const login = async (data, userType) => {
  const loginUrl = `${API_URL}/login/${userType}`;

  const loginResponse = await axios
    .post(loginUrl, {
      email: data.email,
      password: data.password,
    })
    .then((response) => response)
    .catch((error) => formattedError(error.response));
  //? The error handling response was designed by axios like so: 'error.response'.
  //? Details can be found here: https://github.com/axios/axios/issues/376
  return loginResponse;
};

const logout = async () => {
  const logoutUrl = `${API_URL}/logout`;

  const logoutResponse = await axios
    .post(logoutUrl, {})
    .then((response) => response)
    .catch((error) => formattedError(error.response));

  return logoutResponse;
};

export default { login, logout };
