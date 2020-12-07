import axiosClient from './baseAxiosClient';
import { rootPaths } from './apiPathsGenerator';

const login = async (data, userRole) =>
  await axiosClient.postRequest(
    rootPaths.login,
    {
      email: data.email,
      password: data.password,
    },
    userRole
  );

const logout = async () => await axiosClient.postRequest(rootPaths.logout);

export default { login, logout };
