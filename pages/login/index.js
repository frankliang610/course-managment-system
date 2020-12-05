import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Col, Form, Input, Checkbox, Radio, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import {
  StyledButton,
  StyledRow,
  StyledTitle,
} from '../../styles/StyledLoginComponents';
import authApiCall from '../api/auth';
import { Role } from '../../utilities/constant/role';

const LoginPage = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState('student');
  const [errorMessage, setErrorMessage] = useState('');
  const userRoleOnChange = (e) => setUserRole(e.target.value);
  const resetErrorMessage = () => setErrorMessage('');

  const login = async (values) => {
    const response = await authApiCall.login(values, userRole);

    if (response.status === 200) {
      localStorage.setItem('user', JSON.stringify(response.data));
      router.push('/dashboard');
    }

    if (response.status === 401) {
      setErrorMessage(response.message);
    }

    if (response.status === 404) {
      setErrorMessage(response.message);
    }
  };

  return (
    <StyledRow justify="center" align="middle">
      <Col span={12}>
        <Form
          name="loginForm"
          initialValues={{
            rememberMe: true,
          }}
          rules={[
            {
              required: true,
              message: 'Please input your name',
            },
          ]}
          onFinish={login}
        >
          <StyledTitle level={2}>Course Management Assistant</StyledTitle>

          <Form.Item>
            <Radio.Group value={userRole} onChange={userRoleOnChange}>
              <Radio.Button value={Role.student}>Student</Radio.Button>
              <Radio.Button value={Role.teacher}>Teacher</Radio.Button>
              <Radio.Button value={Role.manager}>Manger</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Invalid Email Address!',
              },
              {
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
              {
                min: 4,
                max: 16,
                message: 'Your password must be between 4 and 16 characters!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              Log in
            </StyledButton>
          </Form.Item>

          {errorMessage ? (
            <Form.Item>
              <Alert
                message={errorMessage}
                type="error"
                closable
                afterClose={resetErrorMessage}
              />
            </Form.Item>
          ) : null}
        </Form>
      </Col>
    </StyledRow>
  );
};

export default LoginPage;
