import axiosClient from './baseAxiosClient';

import { rootPaths, subPaths } from './apiPathsGenerator';
import formattedResponse from './formattedResponse';
import { getBaseUrl } from './baseAxiosClient';
import { getUserId } from '../utilities/loginUserInfo';

const baseURL = getBaseUrl();
const userId = getUserId();
const { showResponseMessage } = formattedResponse;

const getMessages = async (params) =>
  await axiosClient.getRequest([rootPaths.message], params).then((res) => showResponseMessage(res));

const getMessageStatistics = async () =>
  await axiosClient
    .getRequest([rootPaths.message, subPaths.statistics])
    .then((res) => showResponseMessage(res));

const messageEvent = () => {
  return new EventSource(`${baseURL}/message/subscribe?userId=${userId}`, {
    withCredentials: true,
  });
};

const markAsRead = async (ids) =>
  await axiosClient
    .putRequest([rootPath.message], { status: 1, ids })
    .then((res) => showResponseMessage(res));

export default {
  getMessages,
  getMessageStatistics,
  messageEvent,
  markAsRead,
};
