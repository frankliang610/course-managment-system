import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'antd';
import Layout from '../../components/Layout';
import {
  StyledATag,
  StyledSearchBar,
} from '../../styles/StyledDashboardComponents';
import getStudentsApiCall from '../api/students';

const Dashboard = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchBarValue, setSearchBarValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const resetErrorMessage = () => setErrorMessage('');

  useEffect(async () => {
    const response = await getStudentsApiCall();

    if (response.status === 200) {
      setStudentsData(response.data.students);
      setLoading(false);
    }

    if (response.status === 404) {
      setErrorMessage(response.message);
      setLoading(false);
    }
  }, []);

  // TODO
  const onSearch = (value) => console.log(value);
  const searchBarValueOnChange = (e) => setSearchBarValue(e.target.value);

  //? Dashboard Table Columns Format
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
          <StyledATag onClick={() => console.log('Edit Btn Clicked')}>
            Edit
          </StyledATag>
          <StyledATag onClick={() => console.log('Delete Btn Clicked')}>
            Delete
          </StyledATag>
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <StyledSearchBar
        placeholder="Search..."
        allowClear
        value={searchBarValue}
        onChange={searchBarValueOnChange}
        onSearch={onSearch}
      />
      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={studentsData}
      />
      {errorMessage ? (
        <Alert
          message={errorMessage}
          type="error"
          closable
          afterClose={resetErrorMessage}
        />
      ) : null}
    </Layout>
  );
};

export default Dashboard;
