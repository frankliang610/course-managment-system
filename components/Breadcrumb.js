import React from 'react';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Role } from '../utilities/constant/role';
import routes from './SideBarNavRoutes';
import { deepSearchFactory } from '../utilities/sidebarNav/deepSearchFunc';
import { getSideNavNameByPath } from '../utilities/sidebarNav/getFuncGenerators';
import { useUserType } from './hooks/useLoginUserState';
import { StyledBreadcrumb } from '../styles/StyledBreadcrumb';

const CustomizedBreadcrumb = () => {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split('/').slice(1);
  const root = '/' + paths.slice(0, 2).join('/');
  const sub = paths.slice(2);
  const userType = useUserType();
  const sideNav = routes[userType];

  return (
    <StyledBreadcrumb>
      <StyledBreadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${userType.toLocaleUpperCase()} SYSTEM`}</Link>
      </StyledBreadcrumb.Item>
      {sub
        .map((item, index) => {
          const path = [root, ...sub.slice(0, index + 1)].join('/');
          const names = getSideNavNameByPath(sideNav, path);

          return [Role.student, Role.manager, Role.teacher].find((role) => role === item)
            ? null
            : names.map((name) => {
                const target = deepSearchFactory(
                  (nav, value) => nav.label === value,
                  name,
                  'subNav'
                )(sideNav);

                return (
                  <Breadcrumb.Item key={index}>
                    {index === sub.length - 1 || !target.path.length ? (
                      name
                    ) : (
                      <Link href={path}>{name}</Link>
                    )}
                  </Breadcrumb.Item>
                );
              });
        })
        .flat(1)}
    </StyledBreadcrumb>
  );
};

export default CustomizedBreadcrumb;
