import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Layout,
  Menu,
  notification,
  Badge,
  Row,
  Dropdown,
  Tabs,
  Col,
  Button,
  Spin,
  List,
  Space,
  Avatar,
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  StyledLayout,
  StyledContentLayout,
  StyledTitle,
  StyledContentHeader,
  StyledContent,
  StyledBrandIcon,
  StyledIcon,
  HeaderIcon,
} from '../styles/StyledLayoutComponents';
import routes from './SideBarNavRoutes';
import CustomizedBreadcrumb from './Breadcrumb';
import { getUserRole, deleteUserInfo, getUserId } from '../utilities/loginUserInfo';
import { getMenuConfig, customizeMenuItems } from './MenuItems';
import authApiCall from '../api-service/auth';
import messageEventApi from '../api-service/messageEvent';
import { useMessages } from '../components/store/messageStore';

const { Sider } = Layout;

const MessageContainer = styled.div`
  height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const TabNavContainer = styled.div`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;

const TabPane = styled(Tabs.TabPane)`
  position: relative;
  .ant-list-item {
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
      background: #1890ff45;
    }
  }
  .ant-list-item-meta-title {
    margin-bottom: 0;
  }
  .ant-list-item-action {
    margin: 0 0 0 48px;
  }
  .ant-list-item-meta-avatar {
    align-self: flex-end;
  }
  .ant-list-item-meta-description {
    margin: 5px 0;
    white-space: normal;
    display: -webkit-box;
    max-height: 3em;
    max-width: 100%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ant-list-item-meta {
    margin-bottom: 0;
  }
`;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
`;

const Messages = (props) => {
  const { type } = props;
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [paginator, setPaginator] = useState({
    limit: 20,
    page: 1,
  });

  useEffect(() => {
    messageEventApi.getMessages({ ...paginator, type }).then((res) => {
      const { data: fetchedData } = res;
      const newData = fetchedData?.messages;
      const totalData = [...data, ...newData];

      setData(totalData);
      setTotal(newData.total);
      setHasMore(total > totalData.length);
    });
  }, [paginator]);

  const fetchMoreData = () => {
    return setPaginator({
      ...paginator,
      page: paginator.page + 1,
    });
  };

  useEffect(() => {
    if (props.clearAll && data && data.length) {
      const ids = data.filter((item) => item.status === 0).map((item) => item.id);

      if (ids.length) {
        apiService.markAsRead(ids).then((res) => {
          if (res.data) {
            setData(data.map((item) => ({ ...item, status: 1 })));
          }

          if (props.onRead) {
            props.onRead(ids.length);
          }
        });
      } else {
        message.warn(`All of these ${props.type}s has been marked as read!`);
      }
    }
  }, [props.clearAll]);

  useEffect(() => {
    if (!!props.message && props.message.type === props.type) {
      setData([props.message, ...data]);
    }
  }, [props.message]);

  return (
    <InfiniteScroll
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      }
      dataLength={data.length}
      endMessage={<div style={{ textAlign: 'center' }}>No more</div>}
      scrollableTarget={props.scrollTarget}
    >
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            style={{ opacity: item.status ? 0.4 : 1 }}
            actions={[
              <Space>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Space>,
            ]}
            onClick={() => {
              if (item.status === 1) {
                return;
              }

              messageEventApi.markAsRead([item.id]).then((res) => {
                if (res.data) {
                  const target = data.find((msg) => item.id === msg.id);

                  target.status = 1;
                  setData([...data]);
                }

                if (props.onRead) {
                  props.onRead(1);
                }
              });
            }}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.from.nickname}
              description={item.content}
            />
          </List.Item>
        )}
      ></List>
    </InfiniteScroll>
  );
};

const MessageBadge = () => {
  const role = getUserRole();
  const types = ['notification', 'message'];
  const [activeType, setActiveType] = useState('notification');
  const { messagesState, dispatch } = useMessages();
  const [message, setMessage] = useState('');
  const [clean, setClean] = useState({
    notification: 0,
    message: 0,
  });

  useEffect(() => {
    messageEventApi.getMessageStatistics().then((res) => {
      const { data } = res;

      if (data) {
        const {
          receive: { notification, message },
        } = data;

        dispatch({
          type: 'increment',
          payload: {
            type: 'message',
            count: message.unread,
          },
        });

        dispatch({
          type: 'increment',
          payload: {
            type: 'notification',
            count: notification.unread,
          },
        });
      }
    });

    const sse = messageEventApi.messageEvent();

    sse.onmessage = (event) => {
      const { data } = event;

      const newData = JSON.parse(data || {});

      if (newData.type !== 'heartbeat') {
        const content = newData.content;

        if (content.type === 'message') {
          notification.info({
            message: `You have a message from ${content.from.nickname}`,
            description: content.content,
          });
        }

        setMessage(content);
        dispatchEvent({
          type: 'increment',
          payload: {
            type: content.type,
            count: 1,
          },
        });
      }
    };

    return () => {
      sse.close();
      dispatch({
        type: 'reset',
      });
    };
  }, []);

  return (
    <Badge size="small" count={messagesState.total} offset={[10, 0]}>
      <HeaderIcon>
        <Dropdown
          overlayStyle={{
            background: '#fff',
            borderRadius: 4,
            width: 400,
            height: 500,
            overflow: 'hidden',
          }}
          placement="bottomRight"
          trigger={['click']}
          overlay={
            <>
              <Tabs
                renderTabBar={(props, DefaultTabBar) => (
                  <TabNavContainer>
                    <DefaultTabBar {...props} />
                  </TabNavContainer>
                )}
                onChange={(key) => {
                  if (key !== activeType) {
                    setActiveType(key);
                  }
                }}
                animated
              >
                {types?.map((type) => {
                  return (
                    <TabPane key={type} tab={`${type} (${messagesState[type]})`}>
                      <MessageContainer id={type}>
                        <Messages
                          type={type}
                          scrollTarget={type}
                          clearAll={clean[type]}
                          onRead={(count) => {
                            dispatch({ type: 'decrement', payload: { type, count } });
                          }}
                          message={message}
                        />
                      </MessageContainer>
                    </TabPane>
                  );
                })}
              </Tabs>

              <Footer justify="space-between" align="middle">
                <Col span={12}>
                  <Button onClick={() => setClean({ ...clean, [activeType]: ++clean[activeType] })}>
                    Mark all as read
                  </Button>
                </Col>
                <Col span={12}>
                  <Button>
                    <Link href={`/dashboard/${role}/message`}>View history</Link>
                  </Button>
                </Col>
              </Footer>
            </>
          }
        >
          <BellOutlined style={{ fontSize: 24, marginTop: 5 }} />
        </Dropdown>
      </HeaderIcon>
    </Badge>
  );
};

const CustomisedLayout = ({ children }) => {
  const router = useRouter();
  const userRole = getUserRole();
  const [collapsed, setCollapsed] = useState(false);
  const sideNav = routes[userRole];
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

          <Row align="middle">
            <MessageBadge />
          </Row>

          <StyledIcon onClick={logOut}>
            <PoweroffOutlined />
          </StyledIcon>
        </StyledContentHeader>
        <CustomizedBreadcrumb />
        <StyledContent>{children}</StyledContent>
      </StyledContentLayout>
    </StyledLayout>
  );
};

export default CustomisedLayout;
