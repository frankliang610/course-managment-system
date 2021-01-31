import { useRouter } from 'next/router';

const KEY = 'cms';

export const getUserInfo = () => {
  try {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem(KEY));
    }
  } catch (error) {
    return null;
  }
};

export const getToken = () => {
  const userInfo = getUserInfo();
  const token = userInfo?.token;
  return token;
};

export const getUserRole = () => {
  const userInfo = getUserInfo();
  const role = userInfo?.role;
  return role;
};

export const setUserInfo = (info) => {
  localStorage.setItem('cms', JSON.stringify(info));
};

export const deleteUserInfo = () => {
  localStorage.removeItem(KEY);
};
