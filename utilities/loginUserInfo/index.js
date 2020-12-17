import { useRouter } from 'next/router';
const KEY = 'user';

export const getUserInfo = () => {
  const router = useRouter();
  let userType = '';

  if (typeof window !== 'undefined') {
    const storedLoginInfo = localStorage.getItem(KEY);
    userType = JSON.parse(storedLoginInfo).type;
  }

  if (!userType) {
    userType = router.pathname.split('/')[2];
  }

  return userType;
};

export const setUserInfo = (info) => {
  localStorage.setItem('user', JSON.stringify(info));
};

export const deleteUserInfo = () => {
  localStorage.removeItem(KEY);
};
