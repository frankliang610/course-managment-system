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

const addCourse = async (newCourse) =>
  await axiosClient
    .postRequest([rootPaths.courses, subPaths.add], newCourse)
    .then((res) => showResponseMessage(res));

const updateCourse = async (updateCourseData) =>
  await axiosClient
    .postRequest([rootPaths.courses, subPaths.update], updateCourseData)
    .then((res) => showResponseMessage(res));

const getCourseTypes = async () =>
  await axiosClient.getRequest([rootPaths.courses, subPaths.courseTypes]);

const createCourseCode = async () =>
  await axiosClient.getRequest([rootPaths.courses, subPaths.generateCode]);

const updateCourseProcess = async (updateCourseProcess) =>
  await axiosClient
    .postRequest([rootPaths.courses, subPaths.courseProcess], updateCourseProcess)
    .then((res) => showResponseMessage(res));

const getProcessById = async (processId) =>
  await axiosClient
    .getRequest([rootPaths.courses, subPaths.courseProcess], { id: processId })
    .then((res) => showResponseMessage(res));

const getTeachers = async (params) =>
  await axiosClient.getRequest([rootPaths.courses, subPaths.courseTeachers], params);

export default {
  getCourses,
  getCourseById,
  addCourse,
  updateCourse,
  getCourseTypes,
  createCourseCode,
  updateCourseProcess,
  getProcessById,
  getTeachers,
};
