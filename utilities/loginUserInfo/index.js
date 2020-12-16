const KEY = 'user';

export const getUserInfo = () => {
  let userInfo;
  if (typeof window !== 'undefined') {
    const storedLoginInfo = localStorage.getItem(KEY);
    userInfo = JSON.parse(storedLoginInfo);
  }

  return userInfo;
};

export const setUserInfo = (info) => {
  localStorage.setItem('user', JSON.stringify(info));
};

export const deleteUserInfo = () => {
  localStorage.removeItem(KEY);
};
