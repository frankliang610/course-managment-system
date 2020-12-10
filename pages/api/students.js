import axiosClient from './baseAxiosClient';
import { rootPaths, subPaths } from './apiPathsGenerator';
import formattedResponse from './formattedResponse';

const { showResponseMessage } = formattedResponse;

const getStudents = async (params) => await axiosClient.getRequest(rootPaths.students, params);

const addStudent = async (newStudentData) =>
  await axiosClient
    .postRequest([rootPaths.students, subPaths.add], newStudentData)
    .then((res) => showResponseMessage(res));

const updateStudent = async (updateStudentData) =>
  await axiosClient
    .postRequest([rootPaths.students, subPaths.update], updateStudentData)
    .then((res) => showResponseMessage(res));

const deleteStudent = async (studentId) =>
  await axiosClient
    .deleteRequest([rootPaths.students, subPaths.delete], studentId)
    .then((res) => showResponseMessage(res));

export default {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};
