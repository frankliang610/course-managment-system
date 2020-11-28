import axios from 'axios';
import { API_URL } from './apiUrl';

const GetStudents = async () => {
  const getStudentsUrl = `${API_URL}/students`;

  const getStudentsResponse = await axios
    .get(getStudentsUrl)
    .then((response) => response)
    .catch((error) => error.response); //* The error handling response was designed by axios like so.
  //* Details can be found here: https://github.com/axios/axios/issues/376

  return getStudentsResponse;
};

export default GetStudents;
