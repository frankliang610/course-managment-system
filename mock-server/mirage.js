import { belongsTo, createServer, hasMany, Model, Response } from 'miragejs';
import studentsData from './student.json';
import usersData from './user.json';
import courseTypesData from './course_type.json';
import coursesData from './course.json';
import studentTypesData from './student_type.json';
import studentCoursesData from './student_course.json';

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
      studentType: Model,
      student: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo('studentType'),
      }),
      courseType: Model,
      course: Model,
      studentCourse: Model.extend({
        student: belongsTo(),
      }),
    },

    seeds(server) {
      usersData.forEach((user) => server.create('user', user));
      studentCoursesData.forEach((course) => server.create('studentCourse', course));
      studentsData.forEach((student) => server.create('student', student));
      studentTypesData.forEach((type) => server.create('studentType', type));
      coursesData.forEach((course) => server.create('course', course));
      courseTypesData.forEach((type) => server.create('courseType', type));
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json') return true;
      });

      this.namespace = '/api';

      //? Auth: Log in
      this.get('/login', (schema, request) => {
        const { loginType, email, password } = request.queryParams;

        const user = schema.users.where({
          email,
          password,
          type: loginType,
        });

        if (user.length) {
          const token = Math.random().toString(32).split('.')[1];
          const successResponse = new Response(
            200,
            {},
            {
              code: 200,
              msg: 'login successfully',
              data: {
                token,
                loginType,
              },
            }
          );

          return successResponse;
        } else {
          return new Response(
            403,
            {},
            {
              code: 400,
              msg: 'Wrong email or password, please try again!',
            }
          );
        }
      });

      //? Auth: Log out
      this.post('/logout', (schema, request) => {
        //* Some logic has to be done here before logging out:
        //* i.e. delete the user token
        return new Response(
          200,
          {},
          {
            code: 200,
            msg: 'logout successfully',
            data: true,
          }
        );
      });

      //? Students List: Get all students
      this.get('/students', (schema, request) => {
        const { db } = schema;
        console.log('schema :>> ', schema);
        console.log('db :>> ', db);
        const { queryParams } = request;
        const studentsDataFromDb = db.students;

        //? Search Query
        const query = queryParams.query || '';
        const queriedData = studentsDataFromDb.filter((student) => student.name.includes(query));

        //? Pagination
        const page = parseInt(queryParams.page, 10) || 1;
        const limit = parseInt(queryParams.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = studentsDataFromDb.length;
        const paginatedData = studentsDataFromDb.slice(startIndex, endIndex);
        const responseStudentsData = query ? queriedData : paginatedData;

        const paginator = {
          limit,
          page: query ? 1 : page,
          total: query ? queriedData.length : total,
        };

        //? Pagination & Search Query Response
        if (schema.students) {
          const successResponse = new Response(
            200,
            {},
            {
              code: 200,
              msg: 'success',
              data: {
                students: responseStudentsData,
                total: limit,
                paginator,
              },
            }
          );
          return successResponse;
        } else {
          //? Pagination & Search Query failure
          const failedResponse = new Response(
            404,
            {},
            {
              code: 400,
              msg: 'Data query failed',
            }
          );
          return failedResponse;
        }
      });

      //? Students List: Add a new student
      this.post('/students/add', (schema, request) => {});

      //? Students List: Edit an existing student
      this.post('/students/update', (schema, request) => {});

      //? Students List: Delete an existing student
      this.del('/students/delete', (schema, request) => {
        const { id } = request.queryParams;
        const targetStudent = schema.students.where({ id });
        if (targetStudent.length) {
          targetStudent.destroy();
          return new Response(
            200,
            {},
            {
              code: 200,
              msg: 'success',
              data: true,
            }
          );
        } else {
          return new Response(
            404,
            {},
            {
              code: 400,
              msg: 'delete failed',
              data: false,
            }
          );
        }
      });
    },
  });

  return server;
}
