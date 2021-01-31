import axiosClient from './baseAxiosClient';
import { AES } from 'crypto-js';
import { rootPaths } from './apiPathsGenerator';
import formattedResponse from './formattedResponse';

const { showResponseMessage } = formattedResponse;

const login = async (data) => {
  return await axiosClient
    .postRequest(rootPaths.login, {
      role: data.userRole,
      email: data.email,
      password: AES.encrypt(data.password, 'cms').toString(),
    })
    .then((res) => res);
};

const logout = async () => await axiosClient.postRequest(rootPaths.logout);

export default { login, logout };
