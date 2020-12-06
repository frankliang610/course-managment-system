import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { Table, Alert, Popconfirm, message } from 'antd';
import Layout from '../../components/Layout';
import {
  StyledATag,
  StyledSearchBar,
} from '../../styles/StyledDashboardComponents';
import studentsApiCall from '../api/students';

const Dashboard = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setSearching] = useState(false);
  const [searchBarInputValue, setSearchBarInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //? Initialize Pagination Object
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    showSizeChanger: true,
    total: 10,
  });
  //? Initialize Query Parameters Object
  const [queryParams, setQueryParams] = useState({
    limit: 10,
    page: 1,
  });

  const resetErrorMessage = () => setErrorMessage('');

  //? Fetch/Refetch/Query Students Data from Db
  useEffect(async () => {
    const response = await studentsApiCall.getStudents(queryParams);

    if (response.status === 200) {
      const { total } = response.data.data.paganitor;
      setStudentsData(response.data.data.students);
      setPagination({
        ...pagination,
        total,
      });
      setLoading(false);
      setSearching(false);
    }

    if (response.status === 404) {
      setErrorMessage(response.data.msg);
      setLoading(false);
    }
  }, [queryParams, setStudentsData]);

  const searchQuery = (queryTerm) => {
    setSearching(true);
    setQueryParams({
      ...queryParams,
      query: queryTerm,
    });
  };

  //? Delay setQueryParams -> delay refetch students from Db
  const debouncedSearchQuery = useCallback(debounce(searchQuery, 550), []);

  //? Enter keystroke/Click the search icon triggers onSearch function
  const onSearch = (queryTerm) => {
    searchQuery(queryTerm);
  };

  const searchBarOnChange = (e) => {
    const { value } = e.target;

    setSearchBarInputValue(value);
    debouncedSearchQuery(value);
  };

  const tableOnChange = (pagination) => {
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

  //? Delete student action
  const deleteStudent = async (data) => {
    const { id, name } = data;
    const response = await studentsApiCall.deleteStudent({ id });
    if (response.status === 200) {
      const afterRemoveTargetStudent = studentsData.filter(
        (student) => student.id !== id
      );
      setStudentsData(afterRemoveTargetStudent);
      tableOnChange(pagination);
      message.info(`Student ${name} has been deleted!`);
    } else {
      message.error(response.message);
    }
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
      render: (_, record) => (
        <span>
          <StyledATag onClick={() => console.log('Edit Btn Clicked')}>
            Edit
          </StyledATag>
          <span className="ant-divider" />
          <Popconfirm
            placement="leftBottom"
            title={`Are you sure to delete student ${record.name}? `}
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => deleteStudent(record)}
          >
            <StyledATag>Delete</StyledATag>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <StyledSearchBar
        placeholder="Search..."
        allowClear
        value={searchBarInputValue}
        onChange={searchBarOnChange}
        onSearch={onSearch}
        loading={isSearching}
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
