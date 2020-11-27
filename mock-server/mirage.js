import { createServer, Model, Response } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      users: Model,
    },

    seeds(server) {
      server.create('user', {
        id: 1,
        name: 'Jack',
        email: 'jack@email.com',
        password: '123456',
        type: 'student',
        token: '123456+jack',
      });
      server.create('user', {
        id: 2,
        name: 'Tom',
        email: 'tom@email.com',
        password: '123456',
        type: 'teacher',
        token: '123456+tom',
      });
      server.create('user', {
        id: 3,
        name: 'Amy',
        email: 'amy@email.com',
        password: '123456',
        type: 'manager',
        token: '123456+amy',
      });
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

      this.post(
        '/login/:type',
        (schema, request) => {
          const res = JSON.parse(request.requestBody);

          const loggedInUser = schema.users.where(
            (user) => user.email === res.email
          );
          // Check the email exists or not
          if (loggedInUser.length < 1) {
            const userNotFound = new Response(
              404,
              {},
              {
                error: 'The User dose NOT exist!',
              }
            );

            return userNotFound;
          } else if (loggedInUser.length === 1) {
            const userFound = loggedInUser.models[0].attrs;
            // Check the password matches or not
            if (userFound.password === res.password) {
              const { token, type } = userFound;

              const newResponse = new Response(200, {}, { token, type });

              return newResponse;
            } else {
              const passwordNotMatch = new Response(
                401,
                {},
                {
                  error: 'Unauthorized!',
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
    },
  });

  return server;
}
