import axios from 'axios';
import { apiPathsGenerator } from './apiPathsGenerator';
import formattedError from './formattedError';

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000/api',
  responseType: 'json',
});

const getRequest = async (path, params = null) => {
  const url = apiPathsGenerator(path, params);
  const res = await axiosClient
    .get(url)
    .then((res) => res)
    .catch((err) => formattedError(err.response)); //? The error handling response was designed by axios like so: 'error.response'.
  //? Details can be found here: https://github.com/axios/axios/issues/376
  return res;
};
const postRequest = async (path, data, params = null) => {
  const url = apiPathsGenerator(path, params);
  const res = await axiosClient
    .post(url, data)
    .then((res) => res)
    .catch((err) => formattedError(err.response));

  return res;
};

export default {
  getRequest,
  postRequest,
};
