import axios from 'axios';
import { apiPathsGenerator } from './apiPathsGenerator';
import formattedResponse from './formattedResponse';

const { formattedError } = formattedResponse;

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000/api',
  responseType: 'json',
});

//* GET Method
const getRequest = async (path, params) => {
  const url = apiPathsGenerator(path, params);
  const response = await axiosClient
    .get(url)
    .then((res) => res.data)
    .catch((err) => formattedError(err.response));

  return response;
};

//* POST Method
const postRequest = async (path, data = null, params = null) => {
  const url = apiPathsGenerator(path, params);
  const response = await axiosClient
    .post(url, data)
    .then((res) => res.data)
    .catch((err) => formattedError(err.response));

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
  deleteRequest,
};
