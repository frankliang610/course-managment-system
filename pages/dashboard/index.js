import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Table, Popconfirm, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Layout from '../../components/Layout';
import {
  StyledATag,
  StyledSearchBar,
  SearchBarAndNewButtonWrapper,
} from '../../styles/StyledDashboardComponents';
import ModalFormWrapper from '../../components/ModalFormWrapper';
import ModalFormBody from '../../components/ModalFormBody';
import studentsApiCall from '../api/students';

const Dashboard = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setSearching] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isAddingNewStudent, setAddingNewStudent] = useState(false);
  const [studentId, setStudentId] = useState(0);
  const [form] = Form.useForm();

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

  //? Fetch/Refetch/Query Students Data from Db
  useEffect(async () => {
    const response = await studentsApiCall.getStudents(queryParams);
    const { students, paginator } = response.data;

    if (students) {
      setStudentsData(students);
      setPagination({
        ...pagination,
        current: paginator.page, //* fixed the bug search didn't work on the 2nd page.
        total: paginator.total,
      });
      setLoading(false);
      setSearching(false);
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

  const modalTitle = isAddingNewStudent ? 'Add New Student' : 'Edit Student';
  const buttonText = isAddingNewStudent ? 'Add' : 'Update';

  const handleEditBtn = (value) => {
    setAddingNewStudent(false);
    if (value) {
      form.setFieldsValue({
        name: value.name,
        email: value.email,
        area: value.area,
        studentType: value.typeName,
      });
      setStudentId(value.id);
    }
    setOpenModal(true);
  };

  //? Modal Control
  const handleOk = () => {
    //? Get all input values from the Form by following the sample from antd:
    //? https://ant.design/components/form/#components-form-demo-form-in-modal
    form.validateFields().then((values) => {
      onSubmitForm(values);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
  };

  //? Call add or update student api
  const onSubmitForm = async (values) => {
    const response = isAddingNewStudent
      ? await studentsApiCall.addStudent(values)
      : await studentsApiCall.updateStudent({ ...values, id: studentId });

    if (response.data) {
      tableOnChange(pagination);
      form.resetFields();
      setOpenModal(false);
    }
  };

  //? Call delete student api
  const deleteStudent = async (data) => {
    const { id } = data;
    const response = await studentsApiCall.deleteStudent({ id });

    if (response.data) {
      const afterRemoveTargetStudent = studentsData.filter((student) => student.id !== id);
      setStudentsData(afterRemoveTargetStudent);
      tableOnChange(pagination);
    }
  };

  //? Dashboard Table Columns Format
  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
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
        {
          text: '新西兰',
          value: '新西兰',
        },
      ],
      onFilter: (value, record) => record.area.indexOf(value) === 0,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Selected Curriculum',
      dataIndex: 'courses',
      key: 'courses',
    },
    {
      title: 'Student Type',
      dataIndex: 'typeName',
      key: 'typeName',
      filters: [
        {
          text: 'Tester',
          value: 'tester',
        },
        {
          text: 'Developer',
          value: 'developer',
        },
      ],
      onFilter: (value, record) => record.typeName === value,
    },
    {
      title: 'Join Time',
      dataIndex: 'ctime',
      key: 'ctime',
      render: (value, record) => formatDistanceToNow(new Date(value), { addSuffix: true }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <span>
          <StyledATag onClick={() => handleEditBtn(record)}>Edit</StyledATag>
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
      <SearchBarAndNewButtonWrapper>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            setAddingNewStudent(true);
            setOpenModal(true);
          }}
        >
          Add
        </Button>
        <StyledSearchBar
          placeholder="Search..."
          allowClear
          onChange={searchBarOnChange}
          onSearch={onSearch}
          loading={isSearching}
        />
      </SearchBarAndNewButtonWrapper>
      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={studentsData}
        pagination={pagination}
        onChange={tableOnChange}
      />
      <ModalFormWrapper
        key="modal-form-wrapper"
        form={form}
        visible={openModal}
        handleCancel={handleCancel}
        title={modalTitle}
        footer={[
          <Button type="primary" htmlType="submit" onClick={handleOk}>
            {buttonText}
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <ModalFormBody key="modal-form-body" form={form} />
      </ModalFormWrapper>
    </Layout>
  );
};

export default Dashboard;
