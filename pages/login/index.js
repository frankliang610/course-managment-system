import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Col, Form, Input, Checkbox, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { StyledButton, StyledRow, StyledTitle } from '../../styles/StyledLoginComponents';
import authApiCall from '../../api-service/auth';
import { Role } from '../../utilities/constant/role';
import { setUserInfo } from '../../utilities/loginUserInfo';

const LoginPage = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState(Role.student);
  const userRoleOnChange = (e) => setUserRole(e.target.value);

  const login = async (values) => {
    const response = await authApiCall.login({ ...values, userRole });
    if (response.data) {
      setUserInfo(response?.data);
      router.push(`/dashboard/${response.data.role}`);
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
            <Radio.Group defaultValue={Role.student} value={userRole} onChange={userRoleOnChange}>
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
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              Log in
            </StyledButton>
          </Form.Item>
        </Form>
      </Col>
    </StyledRow>
  );
};

export default LoginPage;
