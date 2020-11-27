import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
  Radio,
  Alert,
  Typography,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import loginApiCall from './api/login';
import styles from '../styles/Login.module.css';

const LoginPage = () => {
  const { Title } = Typography;
  const router = useRouter();
  const [userType, setUserType] = useState('student');
  const [errorMessage, setErrorMessage] = useState('');

  const loginOnClick = async (values) => {
    console.log('value :>> ', values);
    const response = await loginApiCall(values, userType);

    if (response.status === 200) {
      localStorage.setItem('user', JSON.stringify(response.data));
      router.push('/dashboard');
    }

    if (response.status === 401) {
      setErrorMessage('Wrong password, please try again.');
    }

    if (response.status === 404) {
      setErrorMessage('The user does NOT exist, please contact admin.');
    }
  };

  const userTypeOnChange = (e) => {
    setUserType(e.target.value);
  };

  return (
    <Row justify='center' align='middle' style={{ marginTop: '5%' }}>
      <Col span={12}>
        <Form
          name='normal_login'
          className={styles.loginForm}
          initialValues={{
            remember: true,
          }}
          rules={[
            {
              required: true,
              message: 'Please input your name',
            },
          ]}
          onFinish={loginOnClick}
        >
          <Form.Item style={{ textAlign: 'center' }}>
            <Title level={2}>Course Management Assistant</Title>
          </Form.Item>

          <Form.Item>
            <Radio.Group value={userType} onChange={userTypeOnChange}>
              <Radio.Button value='student'>Student</Radio.Button>
              <Radio.Button value='teacher'>Teacher</Radio.Button>
              <Radio.Button value='manager'>Manger</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name='email'
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
            <Input
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>

          <Form.Item
            name='password'
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
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item name='remember' valuePropName='checked'>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className={styles.loginFormButton}
            >
              Log in
            </Button>
          </Form.Item>

          {errorMessage ? (
            <Form.Item>
              <Alert message={errorMessage} type='error' closable />
            </Form.Item>
          ) : null}
        </Form>
      </Col>
    </Row>
  );
};

export default LoginPage;
