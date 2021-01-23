import React, { useEffect, useState } from 'react';
import { DeploymentUnitOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons';
import { Card, Col, Row, Select } from 'antd';
import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';
import Overview from '../../../components/generalOverview';
import PieChart from '../../../components/generalOverview/charts/Pie';
import LineChart from '../../../components/generalOverview/charts/Line';
import BarChart from '../../../components/generalOverview/charts/Bar';
import HeatChart from '../../../components/generalOverview/charts/Heat';
import { Role } from '../../../utilities/constant/role';
import overviewApiCall from '../../../api-service/generalOverview';

const DistributionWithoutSSR = dynamic(
  () => import('../../../components/generalOverview/charts/Distribution'),
  {
    ssr: false,
  }
);

const OverviewPage = () => {
  const [overview, setOverview] = useState([]);
  const [studentStatistics, setStudentStatistics] = useState([]);
  const [teacherStatistics, setTeacherStatistics] = useState([]);
  const [courseStatistics, setCourseStatistics] = useState([]);
  const [distributionRole, setDistributionRole] = useState(Role.student);
  const [selectedType, setSelectedType] = useState('studentType');

  useEffect(() => {
    overviewApiCall.getStatisticsOverview().then((res) => {
      setOverview(res.data);
    });

    overviewApiCall.getStatisticsDetail(Role.student).then((res) => {
      setStudentStatistics(res.data);
    });

    overviewApiCall.getStatisticsDetail(Role.teacher).then((res) => {
      setTeacherStatistics(res.data);
    });

    overviewApiCall.getStatisticsDetail('course').then((res) => {
      setCourseStatistics(res.data);
    });
  }, []);

  return (
    <Layout>
      {overview && (
        <Row align="middle" gutter={[24, 16]}>
          <Col span={8}>
            <Overview
              title="TOTAL STUDENTS"
              data={overview.student}
              icon={<SolutionOutlined />}
              style={{ background: '#1890ff' }}
            />
          </Col>

          <Col span={8}>
            <Overview
              title="TOTAL TEACHERS"
              data={overview.teacher}
              icon={<DeploymentUnitOutlined />}
              style={{ background: '#673bb7' }}
            />
          </Col>

          <Col span={8}>
            <Overview
              title="TOTAL COURSES"
              data={overview.course}
              icon={<ReadOutlined />}
              style={{ background: '#ffaa16' }}
            />
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title="Distribution"
            extra={
              <Select defaultValue="student" onSelect={setDistributionRole} bordered={false}>
                <Select.Option value={Role.student}>Student</Select.Option>
                <Select.Option value={Role.teacher}>Teacher</Select.Option>
              </Select>
            }
          >
            <DistributionWithoutSSR
              data={
                distributionRole === Role.student
                  ? studentStatistics?.area
                  : teacherStatistics?.country
              }
              title={distributionRole}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Types"
            extra={
              <Select defaultValue={selectedType} bordered={false} onSelect={setSelectedType}>
                <Select.Option value="studentType">Student Type</Select.Option>
                <Select.Option value="courseType">Course Type</Select.Option>
                <Select.Option value="gender">Gender</Select.Option>
              </Select>
            }
          >
            {selectedType === 'studentType' ? (
              <PieChart data={studentStatistics?.typeName} title={selectedType} />
            ) : selectedType === 'courseType' ? (
              <PieChart data={courseStatistics?.typeName} title={selectedType} />
            ) : (
              <Row gutter={16}>
                <Col span={12}>
                  <PieChart
                    data={Object.entries(overview.student.gender).map(([name, amount]) => ({
                      name,
                      amount,
                    }))}
                    title="student gender"
                  />
                </Col>

                <Col span={12}>
                  <PieChart
                    data={Object.entries(overview.teacher.gender).map(([name, amount]) => ({
                      name,
                      amount,
                    }))}
                    title="teacher gender"
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Increment">
            <LineChart
              data={{
                [Role.student]: studentStatistics?.ctime,
                [Role.teacher]: teacherStatistics?.ctime,
                course: courseStatistics?.ctime,
              }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Languages">
            <BarChart
              data={{
                interest: studentStatistics?.interest,
                teacher: teacherStatistics?.skills,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Course Schedule">
            <HeatChart data={courseStatistics?.classTime} title="Course schedule per weekday" />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default OverviewPage;
