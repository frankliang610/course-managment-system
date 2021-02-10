import axiosClient from './baseAxiosClient';
import { rootPaths, subPaths } from './apiPathsGenerator';

const getClassSchedule = async (id) =>
  await axiosClient.getRequest([rootPaths.class, subPaths.schedule], { id }).then((res) => res);

export default {
  getClassSchedule,
};
