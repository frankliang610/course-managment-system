import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Result, Steps } from 'antd';
import Layout from '../../../../components/Layout';
import AddCourseDetailForm from '../../../../components/AddCourseForm';
import AddChapterDetailForm from '../../../../components/AddChapterDetailForm';
import { getUserInfo } from '../../../../utilities/loginUserInfo';

const { Step } = Steps;

const AddCourse = () => {
  const router = useRouter();
  const userRole = getUserInfo();
  const [step, setStep] = useState(0);
  const [course, setCourse] = useState(null);
  const [courseId, setCourseId] = useState(0);
  const [scheduleId, setScheduleId] = useState(0);
  const [processId, setProcessId] = useState(0);
  const [navigate, setNavigate] = useState([0]);
  const next = () => {
    setStep(step + 1);
    setNavigate([...navigate, step + 1]);
  };

  const steps = [
    <AddCourseDetailForm
      onSuccess={(course) => {
        setCourse(course);
        setCourseId(course.id);
        setScheduleId(course.scheduleId);
        setProcessId(course.processId);
        next();
      }}
      course={course}
    />,
    <AddChapterDetailForm
      courseId={courseId}
      scheduleId={scheduleId}
      processId={processId}
      onSuccess={next}
    />,
    <Result
      status="success"
      title="Create Course Successfully"
      extra={[
        <Button
          type="primary"
          key="detail"
          onClick={() => router.push(`/dashboard/${userRole}/courses/${courseId}`)}
        >
          Go Course
        </Button>,
        <Button
          key="again"
          onClick={() => {
            router.reload();
          }}
        >
          Create Again
        </Button>,
      ]}
    />,
  ];

  return (
    <Layout>
      <Steps
        current={step}
        type="navigation"
        onChange={(current) => {
          if (navigate.includes(current)) {
            setStep(current);
          }
        }}
        style={{ padding: '1em 1.6%', margin: '20px 0' }}
      >
        <Step title="Course Detail" />
        <Step title="Course Schedule" />
        <Step title="Success" />
      </Steps>
      {steps.map((content, index) => (
        <div key={index} style={{ display: index === step ? 'block' : 'none' }}>
          {content}
        </div>
      ))}
    </Layout>
  );
};

export default AddCourse;
