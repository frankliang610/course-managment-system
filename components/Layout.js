import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SelectOutlined,
  PoweroffOutlined,
  UserOutlined,
} from '@ant-design/icons';

import {
  StyledLayout,
  StyledContentLayout,
  StyledTitle,
  StyledContentHeader,
  StyledContent,
  StyledBrandIcon,
  StyledIcon,
} from '../styles/StyledLayoutComponents';
import authApiCall from '../pages/api/auth';

const { Sider } = Layout;

const CustomisedLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const toggle = () => setCollapsed(!collapsed);
  const onCollapse = (collapsed) => setCollapsed(collapsed);
  const logOut = () => {
    localStorage.removeItem('user');
    authApiCall.logout();
    router.push('/login');
  };

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
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item
            key="1"
            icon={<UserOutlined />}
            onClick={() => console.log('Students List is clicked...')}
          >
            Students List
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<SelectOutlined />}
            onClick={() => console.log('Select Student is clicked...')}
          >
            Select Students
          </Menu.Item>
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
        <StyledContent>
          <>{children}</>
        </StyledContent>
      </StyledContentLayout>
    </StyledLayout>
  );
};

export default CustomisedLayout;
