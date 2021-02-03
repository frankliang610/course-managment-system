import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getToken, getUserRole } from '../../utilities/loginUserInfo';

export const useLoginUserState = () => {
  const router = useRouter();
  const role = getUserRole();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.push('/login', undefined, { shallow: true });
    }

    if (role) {
      router.push(`/dashboard/${role}`, undefined, { shallow: true });
    }
  }, []);

  return {
    role,
    token,
  };
};

export const useUserType = () => {
  const role = getUserRole();

  return role;
};
