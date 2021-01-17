import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Select } from 'antd';
import Form from 'antd/lib/form';
import { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { format } from 'date-fns';
import TimePicker from './ReconfiguredTimePicker';
import gutter from '../utilities/constant/gutter';
import validateMessages from '../utilities/constant/validateMessages';
import weekday from '../utilities/constant/weekday';
import coursesApiCall from '../api-service/courses';

const { Option } = Select;

const AddChapterDetailForm = ({ courseId, scheduleId, onSuccess, isCourseAdded = true }) => {
  const [form] = useForm();
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const updateSelectedWeekdays = (namePath) => {
    const selected = form.getFieldValue('classTime') || [];
    let result = selected.map((item) => item.weekday);

    if (namePath) {
      const value = form.getFieldValue(namePath);

      result = result.filter((item) => item !== value);
    }

    setSelectedWeekdays(result);
  };

  const onFinish = (values) => {
    if (!courseId && !scheduleId) {
      message.error('You must select a course to update!');
      return;
    }

    const { classTime: timeSource, chapters } = values;
    const classTime = timeSource?.map(
      ({ weekday, time }) => `${weekday} ${format(time, 'hh:mm:ss')}`
    );
    const request = { chapters, classTime, scheduleId, courseId };

    coursesApiCall.updateCourseProcess(request).then((res) => {
      if (onSuccess && res.data) {
        onSuccess(true);
      }
    });
  };
  const initialValues = {
    chapters: [
      {
        name: '',
        content: '',
      },
    ],
    classTime: [
      {
        weekday: '',
        time: '',
      },
    ],
  };

  useEffect(() => {
    (async () => {
      if (!scheduleId || isCourseAdded) {
        return;
      }

      const { data } = await coursesApiCall.getProcessById(scheduleId);

      if (!!data) {
        const classTimes = data.classTime.map((item) => {
          const [weekday, time] = item.split(' ');

          return { weekday, time: new Date(`2021-01-01 ${time}`) };
        });

        form.setFieldsValue({ chapters: data.chapters, classTime: classTimes });
      }
    })();
  }, [scheduleId]);

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
          <Form.List name="chapters">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        label="name"
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
                        label="content"
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
          <Form.List name="classTime">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        label="weekday"
                        name={[field.name, 'weekday']}
                        fieldKey={[field.fieldKey, 'weekday']}
                        rules={[{ required: true }]}
                      >
                        <Select size="large">
                          {weekday.map((day) => (
                            <Option key={day} value={day} disabled={selectedWeekdays.includes(day)}>
                              {day}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        label="time"
                        name={[field.name, 'time']}
                        fieldKey={[field.fieldKey, 'time']}
                        rules={[{ required: true }]}
                      >
                        <TimePicker size="large" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <FormItem>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              updateSelectedWeekdays(['classTime', field.name, 'weekday']);
                              remove(field.name);
                            } else {
                              message.warn('You must set at least one class time.');
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
                        disabled={fields.length >= 7}
                        onClick={() => {
                          updateSelectedWeekdays();
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Class Time
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
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
