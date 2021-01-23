export const rootPaths = {
  login: 'login',
  logout: 'logout',
  student: 'student',
  students: 'students',
  course: 'course',
  courses: 'courses',
  statistics: 'statistics',
};

export const subPaths = {
  add: 'add',
  update: 'update',
  delete: 'delete',
  detail: 'detail',
  generateCode: 'generate-code',
  courseTypes: 'course-types',
  courseTeachers: 'course-teachers',
  courseProcess: 'course-process',
  overview: 'overview',
};

export const statisticsType = {
  student: 'student',
  teacher: 'teacher',
  course: 'course',
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
