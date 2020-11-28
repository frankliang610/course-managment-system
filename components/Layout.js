import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Styles from '../styles/Layout.module.css';

import { Layout, Menu, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SelectOutlined,
  PoweroffOutlined,
  UserOutlined,
} from '@ant-design/icons';

import authApiCall from '../pages/api/auth';

const { Header, Content, Footer, Sider } = Layout;

const CustomisedLayout = ({ children }) => {
  const { Title } = Typography;
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();

  const toggle = () => setCollapsed(!collapsed);
  const onCollapse = (collapsed) => setCollapsed(collapsed);

  const logOutOnClick = () => {
    localStorage.removeItem('user');
    authApiCall.logout();
    router.push('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Title level={2} className={Styles.logo}>
          {collapsed ? 'C' : 'CMS'}
        </Title>
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
      <Layout className={Styles.siteLayout}>
        <Header className={Styles.header}>
          {collapsed ? (
            <MenuUnfoldOutlined className={Styles.trigger} onClick={toggle} />
          ) : (
            <MenuFoldOutlined className={Styles.trigger} onClick={toggle} />
          )}
          <PoweroffOutlined
            className={Styles.trigger}
            onClick={logOutOnClick}
          />
        </Header>
        <Content style={{ margin: '16px' }}>
          <>{children}</>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
};

export default CustomisedLayout;
