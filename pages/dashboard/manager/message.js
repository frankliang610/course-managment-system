import React, { useEffect, useState } from 'react';
import { AlertOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, List, Row, Select, Space, Spin, Typography } from 'antd';
import styled from 'styled-components';
import { format } from 'date-fns';
import { flatten } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../../../components/Layout';
import { useMessages } from '../../../components/store/messageStore';
import messageEventApi from '../../../api-service/messageEvent';

import { getUserId } from '../../../utilities/loginUserInfo';

const MessageContainer = styled.div`
  padding: 0 20px;
  height: 80vh;
`;

const Message = () => {
  const userId = getUserId();
  const { dispatch } = useMessages();
  const [type, setType] = useState('');
  const [data, setData] = useState([]);
  const [source, setSource] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [paginator, setPaginator] = useState({
    limit: 20,
    page: 1,
  });

  useEffect(() => {
    const param = type ? { ...paginator, type, userId } : { ...paginator, userId };
    messageEventApi.getMessages(param).then((res) => {
      const { data: fetchedData } = res;
      const newData = fetchedData?.messages;
      const totalData = [...data, ...newData];

      setData(totalData);
      setHasMore(fetchedData.total > totalData.length);
    });
  }, [paginator]);

  const fetchMoreData = () => {
    return setPaginator({
      ...paginator,
      page: paginator.page + 1,
    });
  };

  useEffect(() => {
    const result = data.reduce((acc, cur) => {
      const key = format(new Date(cur.createdAt), 'yyyy-MM-dd');

      if (!acc[key]) {
        acc[key] = [cur];
      } else {
        acc[key].push(cur);
      }

      return acc;
    }, source);

    const flattenResult = Object.entries(result).sort(
      (pre, next) => new Date(next[0]).getTime() - new Date(pre[0]).getTime()
    );

    setSource({ ...result });
    setDataSource(flattenResult);
  }, [data]);

  return (
    <Layout>
      <Row align="middle">
        <Col span={8}>
          <Typography.Title level={2}>Recent Messages</Typography.Title>
        </Col>

        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
          <Select
            defaultValue={null}
            onSelect={(value) => {
              setType(value);
              setPaginator({ ...paginator, page: 1 });
              setSource({});
            }}
            style={{ minWidth: 100 }}
          >
            <Select.Option value={null}>All</Select.Option>
            <Select.Option value="notification">Notification</Select.Option>
            <Select.Option value="message">Message</Select.Option>
          </Select>
        </Col>
      </Row>

      <MessageContainer id="msg-container">
        <InfiniteScroll
          next={fetchMoreData}
          hasMore={hasMore}
          scrollThreshold="500px"
          loader={
            <div style={{ textAlign: 'center' }}>
              <Spin size="default" />
            </div>
          }
          dataLength={data.length}
          endMessage={<div style={{ textAlign: 'center' }}>No more messages!</div>}
          scrollableTarget="msg-container"
        >
          <List
            rowKey="index"
            itemLayout="vertical"
            dataSource={dataSource}
            renderItem={([date, values], index) => (
              <React.Fragment key={index}>
                <Space size="large">
                  <Typography.Title level={4}>{date}</Typography.Title>
                </Space>
                {values.map((item, index) => (
                  <List.Item
                    key={`${index}-${item.createdAt}`}
                    style={{ opacity: item.status ? 0.4 : 1 }}
                    actions={[<Space>{item.createdAt}</Space>]}
                    extra={
                      <Space>
                        {item.type === 'notification' ? <AlertOutlined /> : <MessageOutlined />}
                      </Space>
                    }
                    onClick={() => {
                      if (item.status === 1) {
                        return;
                      }

                      messageEventApi.markAsRead([item.id]).then((res) => {
                        if (res.data) {
                          let target = null;

                          dataSource.forEach(([_, values]) => {
                            const result = values.find((value) => value.id === item.id);

                            if (!!result) {
                              target = result;
                              throw new Error('End Loop Here!');
                            }
                          });

                          target.status = 1;
                          setDataSource([...dataSource]);
                          dispatch({
                            type: 'decrement',
                            payload: {
                              count: 1,
                              type: item.type,
                            },
                          });
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
                ))}
              </React.Fragment>
            )}
          />
        </InfiniteScroll>
      </MessageContainer>
    </Layout>
  );
};

export default Message;
