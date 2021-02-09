import axiosClient from './baseAxiosClient';
import { rootPaths, subPaths } from './apiPathsGenerator';
import { getBaseUrl } from './baseAxiosClient';
import { getUserId } from '../utilities/loginUserInfo';

const baseURL = getBaseUrl();
const userId = getUserId();

const getMessages = async (params) =>
  await axiosClient.getRequest([rootPaths.message], params).then((res) => res);

const getMessageStatistics = async (params) =>
  await axiosClient.getRequest([rootPaths.message, subPaths.statistics], params).then((res) => res);

const messageEvent = () => {
  return new EventSource(`${baseURL}/message/subscribe?userId=${userId}`, {
    withCredentials: true,
  });
};

const markAsRead = async (ids) =>
  await axiosClient.putRequest(rootPaths.message, { status: 1, ids }).then((res) => res);

export default {
  getMessages,
  getMessageStatistics,
  messageEvent,
  markAsRead,
};
