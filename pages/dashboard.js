import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import Layout from '../components/Layout';
import getStudentsApiCall from './api/students';

const Dashboard = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentsApiCall().then((res) => {
      setStudentsData(res.data.students);
      setLoading(false);
    });
  }, []);

  // Add an unique key prop to each row
  const cleanupStudentsData = studentsData.map((st) => {
    return {
      ...st,
      key: st.id + st.name,
    };
  });

  // Dashboard Table Columns Format
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Area',
      dataIndex: 'address',
      key: 'address',
      filters: [
        {
          text: '国内',
          value: '国内',
        },
        {
          text: '澳洲',
          value: '澳洲',
        },
        {
          text: '加拿大',
          value: '加拿大',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Selected Curriculum',
      dataIndex: 'selectedCurriculum',
      key: 'selectedCurriculum',
    },
    {
      title: 'Student Type',
      dataIndex: 'studentType',
      key: 'studentType',
      filters: [
        {
          text: 'Student',
          value: 'student',
        },
        {
          text: 'Teacher',
          value: 'teacher',
        },
        {
          text: 'Manager',
          value: 'manager',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    },
    { title: 'Join Time', dataIndex: 'joinTime', key: 'joinTime' },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: () => (
        <span>
          <a
            style={{ marginRight: 8 }}
            onClick={() => console.log('Edit Btn Clicked')}
          >
            Edit
          </a>
          <a
            style={{ marginRight: 8 }}
            onClick={() => console.log('Delete Btn Clicked')}
          >
            Delete
          </a>
        </span>
      ),
    },
  ];
  return (
    <Layout>
      <Table
        columns={columns}
        dataSource={cleanupStudentsData}
        loading={loading}
      />
    </Layout>
  );
};

export default Dashboard;
