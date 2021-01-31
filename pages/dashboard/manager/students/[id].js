import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import studentsApiCall from '../../../../api-service/students';
import { Typography, Row, Col, Card, Tabs, Table } from 'antd';
import {
  StyledInnerCol,
  StyledAvatar,
  StyledTitle,
  StyledText,
  StyledTag,
} from '../../../../styles/StyledStudentDetailComponent';
import gutter from '../../../../utilities/constant/gutter';

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  return {
    props: { id }, //? will be passed to the page component as props
  };
};

const tagColor = [
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'blanchedalmond',
  'burlywood',
  'chartreuse',
  'cadetblue',
];

const Student = ({ id }) => {
  const router = useRouter();
  const [studentDetail, setStudentDetail] = useState([]);
  const [courses, setCourses] = useState([]);
  const [contact, setContact] = useState([]);
  const [about, setAbout] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = +router.query.id || id;
  const pagination = {
    current: 1,
    pageSize: 10,
  };

  const { Text, Paragraph } = Typography;

  useEffect(() => {
    (async () => {
      const response = await studentsApiCall.getStudentById(studentId);

      if (response.data) {
        const { data } = response;
        setStudentDetail(data);
        setCourses(data.courses);
        setContact([
          { label: 'Name', value: data.name },
          { label: 'Age', value: data.age },
          { label: 'Email', value: data.email },
          { label: 'Phone', value: data.phone },
        ]);
        setAbout([
          { label: 'Education', value: data.education },
          { label: 'Area', value: data.area },
          { label: 'Gender', value: data.gender === 1 ? 'Male' : 'Female' },
          { label: 'Member Period', value: data.memberStartAt + ' - ' + data.memberEndAt },
          { label: 'Type', value: data.typeName },
          { label: 'Create Time', value: data.createdAt },
          { label: 'Update Time', value: data.updateAt },
        ]);
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      render: (_t, _r, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Join Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <Layout>
      <Row gutter={gutter}>
        <Col span={8}>
          <Card title={<StyledAvatar src={studentDetail?.avatar} />}>
            <Row gutter={gutter}>
              {contact?.map((i) => (
                <StyledInnerCol span={12} key={i.label}>
                  <Text strong>{i.label}</Text>
                  <Text>{i.value}</Text>
                </StyledInnerCol>
              ))}
            </Row>
            <Row gutter={gutter}>
              <StyledInnerCol span={24} key="address">
                <Text strong>Address</Text>
                <Text>{studentDetail?.address}</Text>
              </StyledInnerCol>
            </Row>
          </Card>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultValue="1" animated={true}>
              <Tabs.TabPane tab="About" key="1">
                <StyledTitle level={3}>Information</StyledTitle>
                <Row gutter={gutter}>
                  {about?.map((a) => (
                    <Col span={24} key={a.label}>
                      <StyledText strong>{a.label}:</StyledText>
                      <Text>{a.value}</Text>
                    </Col>
                  ))}
                </Row>

                <StyledTitle level={3}>Interesting</StyledTitle>
                <Row gutter={gutter}>
                  <Col>
                    {studentDetail?.interest?.map((interest, index) => {
                      return (
                        <StyledTag key={interest} color={tagColor[index]}>
                          {interest}
                        </StyledTag>
                      );
                    })}
                  </Col>
                </Row>

                <StyledTitle level={3}>Description</StyledTitle>
                <Row gutter={gutter}>
                  <Col>
                    <Paragraph>{studentDetail?.description}</Paragraph>
                  </Col>
                </Row>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Courses" key="2">
                <Table
                  rowKey="id"
                  columns={columns}
                  loading={loading}
                  dataSource={courses}
                  pagination={pagination}
                />
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Student;
