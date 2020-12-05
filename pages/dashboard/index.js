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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    showSizeChanger: true,
    total: 10,
  });
  const [queryParams, setQueryParams] = useState({
    query: '',
    limit: 10,
    page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchBarValue, setSearchBarValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const resetErrorMessage = () => setErrorMessage('');

  useEffect(async () => {
    const response = await getStudentsApiCall(queryParams);

    if (response.status === 200) {
      const { total } = response.data.data.paganitor;
      setStudentsData(response.data.data.students);
      setPagination({
        ...pagination,
        total,
      });
      setLoading(false);
    }

    if (response.status === 404) {
      setErrorMessage(response.data.msg);
      setLoading(false);
    }
  }, [queryParams]);

  // TODO
  const onSearch = async (value) => {
    console.log(value);
  };
  const searchBarValueOnChange = (e) => setSearchBarValue(e.target.value);

  const tableOnChange = (pagination, filters, sorter, extra) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    setQueryParams({
      ...queryParams,
      limit: pagination.pageSize,
      page: pagination.current,
    });
  };
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
        pagination={pagination}
        onChange={tableOnChange}
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
