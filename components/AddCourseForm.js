import React, { useState, useEffect } from 'react';
import { useForm } from 'antd/lib/form/Form';
import coursesApiCall from '../api-service/courses';
import {
  Form,
  Row,
  Col,
  Button,
  Input,
  InputNumber,
  message,
  Select,
  Upload,
  Modal,
  Spin,
} from 'antd';
import { CloseCircleOutlined, InboxOutlined, KeyOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import ImgCrop from 'antd-img-crop';
import { format, getTime } from 'date-fns';
import styled from 'styled-components';
import durationUnit from '../utilities/constant/duration';
import gutter from '../utilities/constant/gutter';
import validateMessages from '../utilities/constant/validateMessages';
import InputNumberWithUnit from '../components/InputNumberWithUnit';
import DatePicker from '../components/ReconfiguredDatePicker';

const TextAreaWrapper = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-form-item-control-input,
  .ant-form-item-control-input-content,
  text-area {
    height: 100%;
  }
`;

const UploadWrapper = styled(Form.Item)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input {
    margin-right: 12px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload-picture-card-wrapper img {
    object-fit: cover !important;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
`;

const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  width: 100%;
  .anticon {
    font-size: 45px;
    color: #1890ff;
  }
  p {
    font-size: 24px;
    color: #999999;
  }
`;

const DeleteIcon = styled(CloseCircleOutlined)`
  color: #ff0000;
  position: absolute;
  right: -10px;
  top: 1em;
  font-size: 24px;
  opacity: 0.5;
`;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const validateDuration = (_, value) => {
  if (value) return Promise.resolve();
  return Promise.reject('Duration must be greater than 0!');
};

const AddCourseForm = ({ course, onSuccess }) => {
  const [form] = useForm();
  const [isCourseCodeDisplayed, setCourseCodeDisplayed] = useState(true);
  const [courseTypes, setCourseTypes] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [isTeacherSearching, setTeacherSearching] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [isCourseAdded, setCourseAdded] = useState(false);
  const [preview, setPreview] = useState({
    previewTitle: '',
    previewVisible: false,
    previewImage: '',
  });

  const uploadButton = (
    <UploadContent>
      <InboxOutlined />
      <p>Click or drag images to this area to upload.</p>
    </UploadContent>
  );

  const getCourseCode = () => {
    coursesApiCall.createCourseCode().then((res) => {
      form.setFieldsValue({ uid: res.data });
      setCourseCodeDisplayed(false);
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreview({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndex('/') + 1),
    });
  };

  const onFinish = async (values) => {
    if (!isCourseAdded && course) {
      message.error('One course must be selected to update');
      return;
    }

    const { cover, startTime, duration, typeId, teacherId } = values;
    const newCourse = {
      ...values,
      cover,
      duration: +duration.number,
      typeId: +typeId,
      startTime: format(startTime, 'yyy-MM-dd'), // Error invalid time value, tried parse() and parseISO()
      teacherId: +teacherId || +course.teacherId,
      durationUnit: duration.unit,
    };

    const response = !isCourseAdded
      ? coursesApiCall.addCourse(newCourse)
      : coursesApiCall.updateCourse({
          ...newCourse,
          id: course.id,
        });
    const { data } = await response;

    if (data && !course) setCourseAdded(true);

    if (onSuccess && data) onSuccess(data);
  };

  useEffect(() => {
    if (!isCourseAdded) getCourseCode();

    coursesApiCall.getCourseTypes().then((res) => {
      setCourseTypes(res.data);
    });
  }, []);

  useEffect(() => {
    if (course) {
      const data = {
        ...course,
        typeId: String(course.typeId),
        teacherId: course.teacher,
        startTime: course.startTime,
        duration: {
          number: course.duration,
          unit: course.durationUnit,
        },
      };
      form.setFieldsValue(data);
      setFileList([
        {
          name: 'Cover Image',
          url: course.cover,
        },
      ]);
      setCourseAdded(true);
    }
  }, [course]);

  return (
    <>
      <Form
        labelCol={{ offset: 1 }}
        wrapperCol={{ offset: 1 }}
        form={form}
        layout="vertical"
        validateMessages={validateMessages}
        onFinish={onFinish}
        initialValues={{
          ['durationUnit']: durationUnit.month,
        }}
      >
        <Row gutter={gutter}>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="name"
              rules={[
                { required: true },
                {
                  max: 100,
                  min: 3,
                },
              ]}
            >
              <Input type="text" placeholder="Course Name" />
            </Form.Item>
          </Col>

          <Col span={16}>
            <Row gutter={gutter}>
              <Col span={8}>
                <Form.Item
                  label="Teacher"
                  name="teacherId"
                  rules={[{ required: true }]}
                  style={{ marginLeft: 5 }}
                >
                  <Select
                    placeholder="Select Teacher"
                    notFoundContent={isTeacherSearching ? <Spin size="small" /> : null}
                    filterOption={false}
                    showSearch
                    onSearch={(query) => {
                      setTeacherSearching(true);
                      coursesApiCall.getTeachers({ query }).then((res) => {
                        if (res.data) {
                          setTeachers(res.data.teachers);
                        }
                        setTeacherSearching(false);
                      });
                    }}
                  >
                    {teachers?.map((teacher) => (
                      <Select.Option key={teacher?.id} value={teacher?.id}>
                        {teacher?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Type" name="typeId" rules={[{ required: true }]}>
                  <Select>
                    {courseTypes.map((type) => (
                      <Select.Option key={type.id} value={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Course Code" name="uid" rules={[{ required: true }]}>
                  <Input
                    type="text"
                    placeholder="Course Code"
                    disabled
                    addonAfter={
                      isCourseCodeDisplayed ? <KeyOutlined style={{ cursor: 'pointer' }} /> : null
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={gutter}>
          <Col span={8}>
            <Form.Item label="Start Date" name="startTime">
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(passedDate) => {
                  const today = getTime(new Date());
                  const date = passedDate.valueOf();
                  return date < today;
                }}
              />
            </Form.Item>

            <Form.Item label="Price" name="price" rules={[{ required: true }]}>
              <InputNumber
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                style={{ width: '100%' }}
              ></InputNumber>
            </Form.Item>

            <Form.Item label="Student Limit" name="maxStudents" rules={[{ required: true }]}>
              <InputNumber min={1} max={10} style={{ width: '100%' }}></InputNumber>
            </Form.Item>

            <Form.Item
              label="Duration"
              name="duration"
              rules={[{ required: true }, { validator: validateDuration }]}
            >
              <InputNumberWithUnit
                options={Object.values(durationUnit).map((item, index) => ({
                  unit: index + 1,
                  label: durationUnit[item],
                }))}
                defaultUnit={durationUnit.month}
              />
            </Form.Item>
          </Col>

          <Col span={8} style={{ position: 'relative' }}>
            <TextAreaWrapper
              label="Description"
              name="detail"
              rules={[
                { required: true },
                { min: 10, max: 1000, message: 'Must be between 100 to 1000 characters.' },
              ]}
            >
              <TextArea placeholder="Course Description" style={{ height: '100%' }} />
            </TextAreaWrapper>
          </Col>

          <Col span={8} style={{ position: 'relative' }}>
            <UploadWrapper label="Cover" name="cover">
              <ImgCrop rotate aspect={16 / 9}>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={({ fileList, file }) => {
                    if (file.response) {
                      form.setFieldsValue({ cover: file.response.url });
                    } else {
                      form.setFieldsValue({ cover: course?.cover ?? '' });
                    }

                    setUploading(file.status === 'uploading');
                    setFileList(fileList);
                  }}
                >
                  {fileList.length > 0 ? null : uploadButton}
                </Upload>
              </ImgCrop>
            </UploadWrapper>
            {isUploading && (
              <DeleteIcon
                onClick={() => {
                  setUploading(false);
                  setFileList([]);
                }}
              />
            )}
          </Col>
        </Row>

        <Row gutter={gutter}>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isUploading}>
                {isCourseAdded ? 'Update Course' : 'Create Course'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Modal
        visible={preview.previewVisible}
        title={preview?.previewTitle}
        onCancel={() =>
          setPreview({
            ...preview,
            previewVisible: false,
          })
        }
        footer={null}
      >
        <img src={preview?.previewImage} alt="preview" style={{ width: '100%' }} />
      </Modal>
    </>
  );
};

export default AddCourseForm;
