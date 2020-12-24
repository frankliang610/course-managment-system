import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';

export const getServerSideProps = async (context) => {
  const { id } = context.params;

  return {
    props: { id }, //? will be passed to the page component as props
  };
};

const Course = ({ id }) => {
  const router = useRouter();
  const courseId = +router.query.id || id;

  return <Layout>Course Id: {courseId}</Layout>;
};

export default Course;
