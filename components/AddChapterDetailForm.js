import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Select, TimePicker } from 'antd';
import Form from 'antd/lib/form';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { format } from 'date-fns';
import gutter from '../utilities/constant/gutter';
import validateMessages from '../utilities/constant/validateMessages';
import weekday from '../utilities/constant/weekday';
import coursesApiCall from '../api-service/courses';

const { Option } = Select;
const chapters = 'chapters';

const AddChapterDetailForm = ({ courseId, onSuccess, processId, isCourseAdded = true }) => {
  const [form] = useForm();

  const onFinish = (values) => {
    if (!courseId && !processId) {
      message.error('You must select a course to update!');
      return;
    }

    const { classTime: origin, chapters } = values;
    const classTime = origin?.map(({ weekday, time }) => `${weekday} ${time}`);
    // const classTime = origin?.map(({ weekday, time }) => `${weekday} ${format(time, 'hh:mm:ss')}`);
    const req = { chapters, classTime, processId, courseId };

    coursesApiCall.updateCourseProcess(req).then((res) => {
      const { data } = res;

      if (onSuccess && data) {
        onSuccess(true);
      }
    });
    onSuccess(true);
  };
  const initialValues = {
    chapters: [{ name: '', content: '' }],
    classTime: [{ weekday: '', time: '' }],
  };

  useEffect(() => {
    (async () => {
      if (!processId || isCourseAdded) {
        return;
      }

      const { data } = await coursesApiCall.getProcessById(processId);

      if (!!data) {
        const classTimes = data.classTime.map((item) => {
          const [weekday, time] = item.split(' ');

          return { weekday, time: new Date(`2020-11-11 ${time}`) };
        });

        form.setFieldsValue({ chapters: data.chapters, classTime: classTimes });
      }
    })();
  }, [processId]);

  return (
    <Form
      form={form}
      name="process"
      onFinish={onFinish}
      autoComplete="off"
      validateMessages={validateMessages}
      style={{ padding: '0 1.6%' }}
      initialValues={initialValues}
    >
      <Row gutter={gutter}>
        <Col span={12}>
          <h2>Chapters</h2>
          <Form.List name={chapters}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Name" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        fieldKey={[field.fieldKey, 'content']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter content" />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <FormItem>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one chapter.');
                            }
                          }}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2>Class times</h2>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddChapterDetailForm;
