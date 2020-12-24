import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import Link from 'next/link';
import { List, Spin, Button, BackTop } from 'antd';
import Layout from '../../../../components/Layout';
import CourseOverview from '../../../../components/CourseOverview';
import coursesApiCall from '../../../../api-service/courses';

const Indicator = styled.div`
  position: relative;
  left: 50%;
  margin-top: 10px;
  transform: translateX(50%);
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
        dataLength={courses.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Indicator>
            <Spin size="default" />
          </Indicator>
        }
        endMessage={<p>No more Courses!</p>}
        scrollableTarget="layoutContent"
        style={{ overflow: 'hidden' }}
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
      <BackTop />
    </Layout>
  );
};

export default Courses;
