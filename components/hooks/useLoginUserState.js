import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getUserInfo } from '../../utilities/loginUserInfo';

export const useLoginUserState = () => {
  const router = useRouter();
  const { loginType, token } = getUserInfo();

  useEffect(() => {
    if (!token) {
      router.push('/login', undefined, { shallow: true });
    }

    if (loginType) {
      router.push(`/dashboard/${loginType}`, undefined, { shallow: true });
    }
  }, []);

  return {
    loginType,
    token,
  };
};

export const useUserType = () => {
  const loginType = getUserInfo();

  return loginType;
};
