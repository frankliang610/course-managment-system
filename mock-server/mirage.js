import { createServer, Model, Response } from 'miragejs';
import students from './students.json';
import users from './users.json';

export function makeServer({ environment = 'development' } = {}) {
  const studentsData = [...students];
  const usersData = [...users];

  let server = createServer({
    environment,

    models: {
      user: Model,
      student: Model,
    },

    seeds(server) {
      usersData.forEach((user) => server.create('user', user));
      studentsData.forEach((student) => server.create('student', student));
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json')
          return true;
      });

      this.namespace = '/api';

      //? Auth: Log in
      this.post('/login', (schema, request) => {
        const req = JSON.parse(request.requestBody);
        const { userRole } = request.queryParams;

        const user = schema.users.where({
          email: req.email,
          password: req.password,
          type: userRole,
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
                loginType: userRole,
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
        const { queryParams } = request;

        //? Pagination
        const page = parseInt(queryParams.page, 10) || 1;
        const limit = parseInt(queryParams.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = schema.db.students.length;
        const paginatedData = db.students.slice(startIndex, endIndex);
        const paginator = {
          limit,
          page,
          total: query ? queriedData.length : total,
        };

        //? Search Query
        const query = queryParams.query || '';
        const queriedData = db.students.where((student) =>
          student.name.includes(query)
        );

        //? Pagination & Search Query Response
        if (schema.students) {
          const successResponse = new Response(
            200,
            {},
            {
              code: 200,
              msg: 'success',
              data: {
                students: query ? queriedData : paginatedData,
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
