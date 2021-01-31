import { formatDistance, subMonths } from 'date-fns';
import { countBy } from 'lodash';

const getPeople = (schema, type) => {
  const all = schema[type].all().models;
  const male = all.filter((item) => item.profile?.gender === 1).length;
  const female = all.filter((item) => item.profile?.gender === 2).length;

  return {
    total: all.length,
    lastMonthAdded: schema.teachers.where(
      (item) => new Date(item.createdAt) >= subMonths(new Date(), 1)
    ).models.length,
    gender: { male, female, unknown: all.length - male - female },
  };
};

const getList = (obj) => Object.entries(obj).map(([name, amount]) => ({ name, amount }));

const getCourseDuration = (data, key = 'startEnd') => {
  const dates = data.map((item) => item[key].split(' ')).flat();
  const { max, min } = dates.reduce(
    (acc, cur) => {
      const date = new Date(cur).getTime();
      const { max, min } = acc;

      return { max: date > max ? date : max, min: date < min ? date : min };
    },
    { max: new Date().getTime(), min: new Date().getTime() }
  );

  return formatDistance(new Date(min), new Date(max));
};

const getCourseCreatedTime = (source) => {
  return getList(
    countBy(source, (item) => {
      const index = item.createdAt.lastIndexOf('-');

      return item.createdAt.slice(0, index);
    })
  );
};

const accumulateFactory = (acc) => (key) => {
  if (acc.hasOwnProperty(key)) {
    acc[key] = acc[key] + 1;
  } else {
    acc[key] = 1;
  }
};

export default {
  getPeople,
  getList,
  getCourseDuration,
  getCourseCreatedTime,
  accumulateFactory,
};
