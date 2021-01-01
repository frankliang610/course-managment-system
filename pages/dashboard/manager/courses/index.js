import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import Link from 'next/link';
import { List, Spin, Button, BackTop, Typography } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import Layout from '../../../../components/Layout';
import CourseOverview from '../../../../components/CourseOverview';
import coursesApiCall from '../../../../api-service/courses';

const { Text } = Typography;

const StyledText = styled(Text)`
  position: relative;
  left: 50%;
`;

const Indicator = styled.div`
  margin-top: 10px;
  transform: translateX(50%);
`;

const BackToTopIcon = styled(VerticalAlignTopOutlined)`
  position: fixed;
  bottom: 60px;
  right: 36px;
  z-index: 10;
  font-size: 40px;
  color: #fff;
  padding: 5px;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
  transition: all 0.5s;
  :hover {
    opacity: 0.8;
  }
`;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [paginator, setPaginator] = useState({
    limit: 20,
    page: 1,
  });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    coursesApiCall.getCourses(paginator).then((res) => {
      const { total, courses: fetchedCourses } = res.data;
      const data = [...courses, ...fetchedCourses];
      setCourses(data);
      setHasMore(total > data.length);
    });
  }, [paginator]);

  const fetchMoreData = () => {
    return setPaginator({
      ...paginator,
      page: paginator.page + 1,
    });
  };

  return (
    <Layout>
      <InfiniteScroll
        height={'85vh'}
        width={'auto'}
        className="infinite-scroll"
        dataLength={courses.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Indicator>
            <Spin size="default" />
          </Indicator>
        }
        endMessage={<StyledText strong>No more Courses!</StyledText>}
        style={{ overflowX: 'hidden' }}
      >
        <List
          id="list-container"
          grid={{
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={courses}
          renderItem={(course) => (
            <List.Item key={course.id} style={{ padding: '0 12px' }}>
              <CourseOverview data={course}>
                <Link href={`/dashboard/manager/courses/${course.id}`}>
                  <Button type="primary" style={{ marginTop: 16 }}>
                    Read More...
                  </Button>
                </Link>
              </CourseOverview>
            </List.Item>
          )}
        />
      </InfiniteScroll>
      <BackTop target={() => document.getElementsByClassName('infinite-scroll')[0]}>
        <div>
          <BackToTopIcon />
        </div>
      </BackTop>
    </Layout>
  );
};

export default Courses;
