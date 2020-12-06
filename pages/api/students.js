import axiosClient from './baseAxiosClient';
import { rootPaths, subPaths } from './apiPathsGenerator';

const getStudents = async (params) =>
  await axiosClient.getRequest(rootPaths.students, params);

const addStudent = async (newStudentData) =>
  await axiosClient.postRequest(
    [rootPaths.students, subPaths.add],
    newStudentData,
    studentId
  );

const editStudent = async (studentId, updateData) =>
  await axiosClient.postRequest(
    [rootPaths.students, subPaths.edit],
    updateData,
    studentId
  );

const deleteStudent = async (studentId) =>
  await axiosClient.deleteRequest(
    [rootPaths.students, subPaths.delete],
    studentId
  );

export default {
  getStudents,
  addStudent,
  editStudent,
  deleteStudent,
};
