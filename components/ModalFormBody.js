import React from 'react';
import { Form, Input, Select } from 'antd';

const ModalFormBody = ({ form }) => {
  const { Option } = Select;
  return (
    <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} name="modal-form-body">
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            type: 'email',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="area" label="Area" rules={[{ required: true }]}>
        <Select allowClear placeholder="Select an Area">
          <Option value="Canada">Canada</Option>
          <Option value="Australia">Australia</Option>
          <Option value="New Zealand">New Zealand</Option>
        </Select>
      </Form.Item>

      <Form.Item name="studentType" label="Student Type" rules={[{ required: true }]}>
        <Select allowClear placeholder="Select a type">
          <Option value="tester">Tester</Option>
          <Option value="developer">Developer</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ModalFormBody;
