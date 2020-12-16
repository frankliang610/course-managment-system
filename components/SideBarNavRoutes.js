import React from 'react';
import {
  SmileOutlined,
  CrownOutlined,
  TabletOutlined,
  TeamOutlined,
  UserOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { Role } from '../utilities/constant/role';

const routePath = {
  manager: 'manager',
  teachers: 'teachers',
  students: 'students',
  selectStudents: 'selectStudents',
  courses: 'courses',
};

const overview = {
  path: [],
  label: 'Overview',
  icon: <SmileOutlined />,
};

const students = {
  path: [],
  label: 'Students',
  icon: <SmileOutlined />,
  subNav: [
    {
      path: [routePath.students],
      label: 'Students List',
      icon: <UserOutlined />,
    },
    {
      path: [routePath.selectStudents],
      label: 'Selected Students',
      icon: <SelectOutlined />,
    },
  ],
};

const teachers = {
  path: [],
  label: 'Teachers',
  icon: <CrownOutlined />,
  subNav: [
    {
      path: [routePath.teachers],
      label: 'Teacher List',
      icon: <TeamOutlined />,
      subNav: [
        {
          path: ['teacher-sub'],
          label: 'Teacher Sub',
          icon: <TabletOutlined />,
        },
      ],
    },
  ],
};

const courses = {
  path: [routePath.courses],
  label: 'Courses',
  icon: <TabletOutlined />,
};

const routes = {
  [Role.manager]: [overview, students, teachers, courses],
  [Role.teacher]: [overview, students, courses],
  [Role.student]: [overview, courses],
};

export default routes;