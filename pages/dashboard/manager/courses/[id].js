import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, Badge, Card, Row, Col, Collapse, Steps, Tag, Spin } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import WeeklyTimeTable from '../../../../components/WeeklyTimeTable';
import Layout from '../../../../components/Layout';
import CourseOverview from '../../../../components/CourseOverview';
import CourseStatus from '../../../../utilities/constant/courseStatus';
import coursesApiCall from '../../../../api-service/courses';

const { Title, Text } = Typography;

const StyledContentWrapper = styled.div`
  height: 90vh;
  overflow-x: hidden;
  overflow-y: auto;
`;

const StyledSpin = styled(Spin)`
  position: relative;
  top: 50%;
  left: 50%;
`;

const StyledTitle = styled(Title)`
  color: blueviolet !important;
`;
const StyledSubTitle = styled(Title)`
  margin: 20px 0 0 0;
`;

const StyledCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid #f0f0f0;
  border-left: none;
  :last-child {
    border-right: none;
  }
`;

const StyledRow = styled(Row)`
  width: calc(100% + 48px);
  margin: 0 0 0 -24px !important;
`;

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  return {
    props: { id },
  };
};

const getChapterSteps = (source, index) => {
  const currentStepIndex = source.chapters.findIndex((c) => c.id === source.current);

  if (index === currentStepIndex) {
    return <Tag color={'green'}>Ongoing</Tag>;
  } else if (index < currentStepIndex) {
    return <Tag color={'default'}>Completed</Tag>;
  } else {
    return <Tag color={'orange'}>Todo</Tag>;
  }
};

const Course = ({ id }) => {
  const router = useRouter();
  const courseId = +router.query.id || id;
  const [courseBrief, setCourseBrief] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [data, setData] = useState(null);
  const gutter = [6, 16];

  useEffect(() => {
    (async () => {
      const { data } = await coursesApiCall.getCourseById(courseId);
      const currentStepIndex = data.schedule.chapters.findIndex(
        (c) => c.id === data.schedule.current
      );

      if (data) {
        const { sales } = data;
        const formatBrief = [
          { label: 'Price', value: sales.price },
          { label: 'Batches', value: sales.batches },
          { label: 'Students', value: sales.studentAmount },
          { label: 'Earings', value: sales.earnings },
        ];

        setCourseBrief(formatBrief);
        setCurrentChapterIndex(currentStepIndex);
        setData(data);
      }
    })();
  }, []);

  return (
    <Layout>
      {!data ? (
        <StyledSpin />
      ) : (
        <StyledContentWrapper>
          <Row gutter={gutter}>
            <Col span={8}>
              <CourseOverview data={data} cardProp={{ bodyStyle: { paddingBottom: 0 } }}>
                <StyledRow gutter={gutter} justify="space-between" align="middle">
                  {courseBrief.map((item, index) => (
                    <StyledCol span="6" key={index}>
                      <StyledTitle level={3}>{item.value}</StyledTitle>
                      <Text>{item.label}</Text>
                    </StyledCol>
                  ))}
                </StyledRow>
              </CourseOverview>
            </Col>

            <Col offset={1} span={15}>
              <Card>
                <StyledTitle level={2}>Course Detail</StyledTitle>

                <StyledSubTitle level={3}>Create Time</StyledSubTitle>
                <Row>{data.ctime}</Row>

                <StyledSubTitle level={3}>Start Time</StyledSubTitle>
                <Row>{data.startTime}</Row>

                <Badge status={CourseStatus[data.status]} offset={[5, 24]}>
                  <StyledSubTitle level={3}>Status</StyledSubTitle>
                </Badge>
                <Row>
                  <Steps size="small" current={currentChapterIndex}>
                    {data.schedule.chapters.map((c) => (
                      <Steps.Step title={c.name} key={c.id} />
                    ))}
                  </Steps>
                </Row>

                <StyledSubTitle level={3}>Course Code</StyledSubTitle>
                <Row>{data.uid}</Row>

                <StyledSubTitle level={3}>Class Time</StyledSubTitle>
                <WeeklyTimeTable data={data.schedule.classTime} />

                <StyledSubTitle level={3}>Category</StyledSubTitle>
                <Row>
                  <Tag color={'geekblue'}>{data.typeName}</Tag>
                </Row>

                <StyledSubTitle level={3}>Description</StyledSubTitle>
                {data.detail !== 'no' ? (
                  <Row>{data.detail}</Row>
                ) : (
                  <Row>This is Course Description, blah, blah.....</Row>
                )}

                <StyledSubTitle level={3}>Chapter</StyledSubTitle>
                <Collapse
                  defaultActiveKey={data.schedule.current}
                  expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                >
                  {data.schedule.chapters.map((sc, index) => (
                    <Collapse.Panel
                      header={sc.name}
                      key={sc.id}
                      extra={getChapterSteps(data.schedule, index)}
                    >
                      <Text>{sc.content}</Text>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </Card>
            </Col>
          </Row>
        </StyledContentWrapper>
      )}
    </Layout>
  );
};

export default Course;
