import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, PoweroffOutlined } from '@ant-design/icons';

import {
  StyledLayout,
  StyledContentLayout,
  StyledTitle,
  StyledContentHeader,
  StyledContent,
  StyledBrandIcon,
  StyledIcon,
} from '../styles/StyledLayoutComponents';
import routes from './SideBarNavRoutes';
import CustomizedBreadcrumb from './Breadcrumb';
import { getUserInfo, deleteUserInfo } from '../utilities/loginUserInfo';
import { getMenuConfig, customizeMenuItems } from './MenuItems';
import authApiCall from '../pages/api/auth';

const { Sider } = Layout;

const CustomisedLayout = ({ children }) => {
  const router = useRouter();
  const userType = getUserInfo();
  const [collapsed, setCollapsed] = useState(false);
  const sideNav = routes[userType];
  const toggle = () => setCollapsed(!collapsed);
  const onCollapse = (collapsed) => setCollapsed(collapsed);
  const logOut = async () => {
    const response = await authApiCall.logout();
    if (response.data) {
      deleteUserInfo();
      router.push('/login');
    }
  };
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNav);
  const menuItems = customizeMenuItems(sideNav);

  return (
    <StyledLayout>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <StyledBrandIcon>
          {collapsed ? (
            <StyledTitle level={4}>CMS</StyledTitle>
          ) : (
            <StyledTitle level={2}>CMS</StyledTitle>
          )}
        </StyledBrandIcon>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {menuItems}
        </Menu>
      </Sider>

      <StyledContentLayout>
        <StyledContentHeader>
          <StyledIcon onClick={toggle}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </StyledIcon>
          <StyledIcon onClick={logOut}>
            <PoweroffOutlined />
          </StyledIcon>
        </StyledContentHeader>
        <CustomizedBreadcrumb />
        <StyledContent>
          <>{children}</>
        </StyledContent>
      </StyledContentLayout>
    </StyledLayout>
  );
};

export default CustomisedLayout;
