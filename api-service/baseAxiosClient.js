import axios from 'axios';
import { apiPathsGenerator } from './apiPathsGenerator';
import formattedResponse from './formattedResponse';
import { getToken } from '../utilities/loginUserInfo';

const { formattedError } = formattedResponse;

export const getBaseUrl = () => {
  if (process.env.MODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API || 'http://localhost:3001/api';
  } else {
    return 'https://cms.chtoma.com/api';
  }
};
const baseURL = getBaseUrl();
const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  responseType: 'json',
});

axiosClient.interceptors.request.use((config) => {
  if (!config.url.includes('login')) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: 'Bearer ' + getToken(),
      },
    };
  }

  return config;
});

//* GET Method
const getRequest = async (path, params) => {
  const url = apiPathsGenerator(path, params);
  const response = await axiosClient
    .get(url)
    .then((res) => res.data)
    .catch((err) => err);

  return response;
};

//* POST Method
const postRequest = async (path, data = null, params = null) => {
  const url = apiPathsGenerator(path, params);
  const response = await axiosClient
    .post(url, data)
    .then((res) => res.data)
    .catch((err) => err);

  return response;
};

//* PUT Method
const putRequest = async (path, data = null, params = null) => {
  const url = apiPathsGenerator(path, params);
  const response = await axiosClient
    .put(url, data)
    .then((res) => res.data)
    .catch((err) => err);

  return response;
};

//* DELETE Method
const deleteRequest = async (path, params = null) => {
  const url = apiPathsGenerator(path, params);
  const response = await axiosClient
    .delete(url)
    .then((res) => res.data)
    .catch((err) => formattedError(err.response));

  return response;
};

export default {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
};
