export const rootPaths = {
  login: 'login',
  logout: 'logout',
  student: 'student',
  students: 'students',
};

export const subPaths = {
  add: 'add',
  edit: 'edit',
  delete: 'delete',
};

export const apiPathsGenerator = (paths, params) => {
  paths = typeof paths === 'string' ? paths : paths.join('/');
  let queryParams = '';
  let generatedApiPath = '';

  if (!!params) {
    if (typeof params === 'string') {
      generatedApiPath = paths + '/' + params;
    } else {
      queryParams = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      generatedApiPath = paths + '?' + queryParams;
    }
  } else {
    generatedApiPath = paths;
  }

  return generatedApiPath;
};
