import { createServer, Model, Response } from 'miragejs';
import jwt from 'jsonwebtoken';
import studentsData from './students.json';
import usersData from './users.json';

export function makeServer({ environment = 'development' } = {}) {
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

      this.get('/users', (schema) => {
        return schema.users.all();
      });

      //? Log in
      this.post(
        '/login/:type',
        (schema, request) => {
          const res = JSON.parse(request.requestBody);

          const loggedInUser = schema.users.where(
            (user) => user.email === res.email
          );
          //? Check the email exists or not
          if (loggedInUser.length < 1) {
            const userNotFound = new Response(
              404,
              {},
              {
                msg:
                  'The User dose NOT exist! Please contact your Administrator',
              }
            );

            return userNotFound;
          } else if (loggedInUser.length === 1) {
            const userFound = loggedInUser.models[0].attrs;
            //? Check the password matches or not
            if (userFound.password === res.password) {
              const { type } = userFound;
              const token = jwt.sign({}, res.password);
              const newResponse = new Response(200, {}, { token, type });

              return newResponse;
            } else {
              const passwordNotMatch = new Response(
                401,
                {},
                {
                  msg: 'Wrong password, please try again!',
                }
              );

              return passwordNotMatch;
            }
          } else {
            throw new Error('This should not happen');
          }
        },
        { timing: 1000 }
      );

      //? Log out
      this.post('/logout', (schema, request) => {
        //* Some logic here before logging out:
        //* i.e. delete the user token
        return new Response(200, {}, { msg: 'the user logged out!' });
      });

      //? Get all students
      this.get('/students', (schema, request) => {
        const { queryParams } = request;
        const { db } = schema;

        //? Search Query
        const query = queryParams.query || '';
        const queriedData = db.students.where((student) =>
          student.name.includes(query)
        );

        //? Pagination
        const page = parseInt(queryParams.page, 10) || 1;
        const limit = parseInt(queryParams.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = schema.db.students.length;
        const paginatedData = db.students.slice(startIndex, endIndex);
        const paganitor = {
          limit,
          page,
          total: query ? queriedData.length : total,
        };

        //? Pagination Response
        if (!query && schema.students) {
          const successResponse = new Response(
            200,
            {},
            {
              code: 0,
              msg: 'success',
              data: {
                students: paginatedData,
                total: limit,
                paganitor,
              },
            }
          );
          return successResponse;
          //? Search Query Response
        } else if (query && schema.students) {
          const successResponse = new Response(
            200,
            {},
            {
              code: 0,
              msg: 'success',
              data: {
                students: queriedData,
                total: limit,
                paganitor,
              },
            }
          );
          return successResponse;
          //? Pagination & Search Query failure
        } else {
          const NotStudentsData = new Response(
            404,
            {},
            {
              msg: 'fail',
            }
          );
          return NotStudentsData;
        }
      });
    },
  });

  return server;
}
