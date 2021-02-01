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
  const router = useRouter();
  let role = '';
  const userInfo = getUserInfo();
  role = userInfo?.role ?? role;
  if (!role) {
    role = router.pathname.split('/')[2];
  }
  return role;
};

export const getUserId = () => {
  const userInfo = getUserInfo();
  const userId = userInfo?.userId;
  return userId;
};

export const setUserInfo = (info) => {
  localStorage.setItem('cms', JSON.stringify(info));
};

export const deleteUserInfo = () => {
  localStorage.removeItem(KEY);
};
