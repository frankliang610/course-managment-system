import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col } from 'antd';
import { HeartFilled, UserOutlined } from '@ant-design/icons';
import { DurationUnit } from '../utilities/constant/duration';

const StyledRow = styled(Row)`
  position: relative;
  ::after {
    content: '';
    position: absolute;
    bottom: 0;
    background: #f0f0f0;
    width: 100%;
    height: 1px;
  }
`;

const gutter = {
  xs: 8,
  sm: 16,
  md: 24,
};

const getDurationText = (duration, durationUnit) => {
  const text = `${duration} ${DurationUnit[durationUnit]}`;
  const displayText = duration > 1 ? text + 's' : text;

  return displayText;
};

const CourseOverview = ({ data, children }) => {
  const { cover, duration, durationUnit, name, startTime, star, teacherName, maxStudents } = data;
  return (
    <Card cover={<img src={cover} />}>
      <Row gutter={gutter}>
        <h3>{name}</h3>
      </Row>

      <StyledRow gutter={gutter} justify="space-between" align="middle">
        <Col>{startTime}</Col>
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: 'red' }} />
          <b>{star}</b>
        </Col>
      </StyledRow>

      <StyledRow gutter={gutter} justify="space-between">
        <Col>Duration:</Col>
        <Col>
          <b>{getDurationText(duration, durationUnit)}</b>
        </Col>
      </StyledRow>

      <StyledRow gutter={gutter} justify="space-between">
        <Col>Teacher:</Col>
        <Col style={{ fontWeight: 'bold' }}>{teacherName}</Col>
      </StyledRow>

      <StyledRow gutter={gutter} justify="space-between">
        <Col>
          <UserOutlined style={{ marginRight: 5, fontSize: 16, color: '#1E90FF' }} />
          <span>Student Limit: </span>
        </Col>
        <Col>
          <b>{maxStudents}</b>
        </Col>
      </StyledRow>
      {children}
    </Card>
  );
};

export default CourseOverview;
