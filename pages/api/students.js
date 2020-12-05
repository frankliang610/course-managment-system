import axiosClient from './baseAxiosClient';
import { rootPaths } from './apiPathsGenerator';

const getStudents = async (params) =>
  await axiosClient.getRequest(rootPaths.students, params);

export default getStudents;
