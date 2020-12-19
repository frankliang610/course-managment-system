import axiosClient from './baseAxiosClient';
import { rootPaths } from './apiPathsGenerator';
import formattedResponse from './formattedResponse';

const { showResponseMessage } = formattedResponse;

const login = async (data) =>
  await axiosClient
    .getRequest(rootPaths.login, {
      loginType: data.userRole,
      email: data.email,
      password: data.password,
    })
    .then((res) => showResponseMessage(res));

const logout = async () => await axiosClient.postRequest(rootPaths.logout);

export default { login, logout };
