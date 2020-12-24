import { memoize } from 'lodash';
import { useRouter } from 'next/router';
import { useUserType } from '../../components/hooks/useLoginUserState';

export const generateKey = (data, index) => `${data.label}-${index}`;

const generatePath = (data) => data.path.join('/');

const generateFactory = (fn) =>
  function innerFn(data, current = '') {
    const keys = data?.map((item, index) => {
      let key = fn(item, index);

      if (current) {
        key = [current, key].join('/');
      }

      if (item.subNav && item.subNav.length) {
        return innerFn(item.subNav, key).map((item) => item.join('/'));
      } else {
        return [key];
      }
    });

    return keys;
  };

const isDetailedPath = (path) => {
  const paths = path.split('/');
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

const omitDetailedPath = (path) => {
  const isDetailed = isDetailedPath(path);

  return isDetailed ? path.slice(0, path.lastIndexOf('/')) : path;
};

const generateKeyPathInfo = (data) => {
  const getPaths = generateFactory(generatePath);
  const userType = useUserType();
  const paths = getPaths(data)
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map((item) => ['/dashboard', userType, item].filter((item) => !!item).join('/'));
  const getKeys = generateFactory(generateKey);
  const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

  return { keys, paths };
};

const memoizedGenerateKeyPathInfo = memoize(generateKeyPathInfo, (data) =>
  data?.map((item) => item.label).join('-')
);

export const getActiveKey = (data) => {
  const router = useRouter();
  const activeRoute = omitDetailedPath(router.pathname);
  const { paths, keys } = memoizedGenerateKeyPathInfo(data);
  const index = paths.findIndex((item) => item === activeRoute);

  return keys[index] || '';
};

export const getSideNavNameByKey = (key) => key.split('/').map((item) => item.split('-')[0]);

export const getSideNavNameByPath = (data, path) => {
  if (isDetailedPath(path)) {
    return ['Detail'];
  }

  const { paths, keys } = memoizedGenerateKeyPathInfo(data);
  const index = paths.findIndex((item) => item === path);

  return getSideNavNameByKey(keys[index]);
};
