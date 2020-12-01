import axios from 'axios';
import { API_URL } from './apiUrl';
import formattedError from './formattedError';

const GetStudents = async () => {
  const getStudentsUrl = `${API_URL}/students`;

  const getStudentsResponse = await axios
    .get(getStudentsUrl)
    .then((response) => response)
    .catch((error) => formattedError(error.response));
  //? The error handling response was designed by axios like so: 'error.response'.
  //? Details can be found here: https://github.com/axios/axios/issues/376

  return getStudentsResponse;
};

export default GetStudents;
