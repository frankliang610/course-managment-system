import axiosClient from './baseAxiosClient';
import { rootPaths, subPaths } from './apiPathsGenerator';
import formattedResponse from './formattedResponse';

const { showResponseMessage } = formattedResponse;

const getCourses = async (params) =>
  await axiosClient.getRequest(rootPaths.courses, params).then((res) => showResponseMessage(res));

const getCourseById = async (courseId) =>
  await axiosClient
    .getRequest([rootPaths.courses, subPaths.detail], { id: courseId })
    .then((res) => showResponseMessage(res));

export default {
  getCourses,
  getCourseById,
};
