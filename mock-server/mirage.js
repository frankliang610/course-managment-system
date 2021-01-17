import { inflections } from 'inflected';
import { createServer, Model, belongsTo, hasMany, Response } from 'miragejs';
import studentsData from './student.json';
import usersData from './user.json';
import courseTypesData from './course_type.json';
import coursesData from './course.json';
import studentTypesData from './student_type.json';
import studentCoursesData from './student_course.json';
import studentProfileData from './student-profile.json';
import teachersData from './teacher.json';
import scheduleData from './schedule.json';
import salesData from './sales.json';
import processData from './process.json';
import format from 'date-fns/format';

export function makeServer({ environment = 'development' } = {}) {
  inflections('en', function (inflect) {
    inflect.irregular('sales', 'sales');
  });

  let server = createServer({
    environment,

    models: {
      user: Model,
      studentType: Model,
      student: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo('studentType'),
        profile: belongsTo(),
      }),
      courseType: Model,
      course: Model.extend({
        type: belongsTo('courseType'),
        teacher: belongsTo(),
        schedule: belongsTo(),
        sales: belongsTo(),
      }),
      studentCourse: Model.extend({
        course: belongsTo(),
      }),
      profile: Model.extend({
        studentCourses: hasMany(),
      }),
      teacher: Model,
      schedule: Model,
      sales: Model,
      process: Model,
    },

    seeds(server) {
      teachersData.forEach((teacher) => server.create('teacher', teacher));
      courseTypesData.forEach((type) => server.create('courseType', type));
      scheduleData.forEach((schedule) => server.create('schedule', schedule));
      salesData.forEach((sales) => server.create('sales', sales));
      processData.forEach((process) => server.create('process', process));
      coursesData.forEach((course) => server.create('course', course));
      usersData.forEach((user) => server.create('user', user));
      studentTypesData.forEach((type) => server.create('studentType', type));
      studentCoursesData.forEach((course) => server.create('studentCourse', course));
      studentProfileData.forEach((student) => server.create('profile', student));
      studentsData.forEach((student) => server.create('student', student));
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
        const { queryParams } = request;
        const studentsDataFromDb = schema.students.all().models.map((student) => {
          let courses;

          if (student.studentCourses.length) {
            courses = student.studentCourses.models.map((c) => {
              return {
                id: c.id,
                name: c.course.name,
              };
            });
          }
          student.attrs.courses = courses;
          student.attrs.typeName = student.type.attrs.name;

          return student;
        });

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

      //? Student Detail: Show student Profile
      this.get('/students/detail', (schema, request) => {
        const { id } = request.queryParams;
        const student = schema.students.findBy({ id });
        const selectedStudent = student.profile;

        if (selectedStudent) {
          selectedStudent.attrs.courses = selectedStudent.studentCourses.models.map((sc) => {
            sc.attrs.name = sc.course.attrs.name;
            sc.attrs.type = sc.course.type.attrs.name;

            return sc;
          });

          selectedStudent.attrs.typeName = student.type.attrs.name;

          return new Response(
            200,
            {},
            {
              code: 200,
              msg: 'Success',
              data: selectedStudent,
            }
          );
        } else {
          return new Response(
            400,
            {},
            {
              code: 400,
              msg: 'Profile does NOT exist!!',
              data: false,
            }
          );
        }
      });

      //? Students List: Add a new student
      this.post('/students/add', (schema, request) => {
        const requestBody = JSON.parse(request.requestBody);
        const { name, email, area, type } = requestBody;
        const newStudent = schema.students.create({
          name,
          email,
          area,
          typeId: type,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        });

        newStudent.attrs.typeName = newStudent.type.name;

        if (newStudent) {
          return new Response(
            201,
            {},
            {
              code: 201,
              msg: 'success',
              data: newStudent,
            }
          );
        } else {
          return new Response(
            400,
            {},
            {
              code: 400,
              msg: 'create new student failed',
              data: false,
            }
          );
        }
      });

      //? Students List: Update an existing student
      this.post('/students/update', (schema, request) => {
        const requestBody = JSON.parse(request.requestBody);
        const { id, name, email, area, type } = requestBody;
        const updateStudent = schema.students.findBy({ id });
        if (updateStudent) {
          const updatedStudent = updateStudent.update({
            name,
            email,
            area,
            typeId: type,
            updateAt: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          });

          updatedStudent.attrs.typeName = updatedStudent.type.name;

          return new Response(
            200,
            {},
            {
              code: 200,
              msg: 'success',
              data: updatedStudent,
            }
          );
        } else {
          return new Response(
            400,
            {},
            {
              code: 400,
              msg: `update failed, cannot find the student ${name}`,
              data: false,
            }
          );
        }
      });

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

      this.get('/courses', (schema, request) => {
        const { queryParams } = request;
        const coursesDataFromDb = schema.courses.all().models;

        coursesDataFromDb.forEach((course) => {
          course.attrs.teacher = course.teacher.attrs.name;
          course.attrs.typeName = course.type.attrs.name;
        });

        //? Pagination
        const page = parseInt(queryParams.page, 10) || 1;
        const limit = parseInt(queryParams.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = coursesDataFromDb.length;
        const paginatedData = coursesDataFromDb.slice(startIndex, endIndex);

        //? Pagination Response
        if (schema.courses) {
          const successResponse = new Response(
            200,
            {},
            {
              code: 200,
              msg: 'success',
              data: {
                courses: paginatedData,
                total,
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

      //? Course Detail: Show course detail
      this.get('/courses/detail', (schema, request) => {
        const { id } = request.queryParams;
        const selectedCourse = schema.courses.findBy({ id });

        if (selectedCourse) {
          selectedCourse.attrs.sales = selectedCourse.sales.attrs;
          selectedCourse.attrs.schedule = selectedCourse.schedule.attrs;
          selectedCourse.attrs.teacher = selectedCourse.teacher.attrs.name;
          selectedCourse.attrs.typeName = selectedCourse.type.attrs.name;

          return new Response(
            200,
            {},
            {
              code: 200,
              msg: 'Success',
              data: selectedCourse,
            }
          );
        } else {
          return new Response(
            400,
            {},
            {
              code: 400,
              msg: 'Course does NOT exist!!',
              data: false,
            }
          );
        }
      });

      //? Get a Course Code for adding a new Course
      this.get('/courses/generate-code', (schema, request) => {
        return new Response(
          200,
          {},
          {
            code: 200,
            msg: 'Success',
            data: Math.random().toString(32).split('.')[1],
          }
        );
      });

      //? Get types for adding a new Course
      this.get('/courses/course-types', (schema, request) => {
        const types = schema.courseTypes.all().models.map((ct) => ct);

        return new Response(
          200,
          {},
          {
            code: 200,
            msg: 'Success',
            data: types,
          }
        );
      });

      //? Get a teacher for creating a new Course
      this.get('/courses/course-teachers', (schema, request) => {
        const { queryParams } = request;
        const query = queryParams.query.toLocaleLowerCase() || '';
        const teachers = schema.teachers
          .all()
          .models.filter((t) => t.attrs.name.toLowerCase().includes(query));

        return new Response(
          200,
          {},
          {
            code: 200,
            msg: 'Success',
            data: { teachers },
          }
        );
      });

      //? Add a new course
      this.post('/courses/add', (schema, request) => {
        const requestBody = JSON.parse(request.requestBody);
        const {
          name,
          uid,
          cover,
          detail,
          duration,
          maxStudents,
          price,
          startTime,
          typeId,
          durationUnit,
          teacherId,
        } = requestBody;

        const schedule = schema.schedules.create({
          id: parseInt(schema.schedules.all().length + 1),
          status: 0,
          current: 0,
          classTime: [],
          chapters: [],
        });
        const sales = schema.sales.create({
          batches: 0,
          price,
          earnings: 0,
          paidAmount: 0,
          studentAmount: 0,
          paidIds: [],
        });

        const currentCourseIds = schema.db.courses.map((c) => c.id);
        const currentCourseMaxId = Math.max(...currentCourseIds);
        const newCourseId = currentCourseMaxId + 1;
        const newCourse = schema.db.courses.insert({
          id: newCourseId,
          name,
          uid,
          detail,
          startTime,
          price,
          maxStudents,
          sales,
          schedule,
          star: 0,
          status: 0,
          duration,
          durationUnit,
          cover,
          teacherId,
          typeId,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        });

        if (newCourse) {
          newCourse.typeName = schema.courseTypes.findBy({ id: typeId }).name;
          newCourse.scheduleId = +schedule.id;

          return new Response(
            201,
            {},
            {
              code: 201,
              msg: 'success',
              data: newCourse,
            }
          );
        } else {
          return new Response(
            400,
            {},
            {
              code: 400,
              msg: 'create new course failed',
              data: false,
            }
          );
        }
      });

      this.get('/courses/course-process', (schema, request) => {
        const { id } = request.queryParams;
        const data = schema.schedules.findBy({ id });

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/courses/course-process', (schema, request) => {
        const body = JSON.parse(request.requestBody);
        const { processId, courseId } = body;
        let target;

        if (processId || courseId) {
          if (processId) {
            target = schema.schedules.findBy({ id: processId });
          } else {
            target = schema.courses.findBy({ id: courseId }).schedule;
          }
          const { classTime, chapters } = body;

          target.update({
            current: 0,
            status: 0,
            chapters: chapters.map((item, index) => ({ ...item, id: index })),
            classTime,
          });

          return new Response(200, {}, { msg: 'success', code: 200, data: true });
        } else {
          return new Response(
            400,
            {},
            {
              msg: `can\'t find process by course ${courseId} or processId ${processId} `,
              code: 400,
            }
          );
        }
      });

      //? Update an existing course
      this.post('/courses/update', (schema, request) => {
        const requestBody = JSON.parse(request.requestBody);
        const updateCourse = 'update course';

        if (updateCourse) {
          return new Response(
            200,
            {},
            {
              code: 200,
              msg: 'success',
              data: updateCourse,
            }
          );
        } else {
          return new Response(
            400,
            {},
            {
              code: 400,
              msg: `update failed, cannot find the course`,
              data: false,
            }
          );
        }
      });

      this.post('https://www.mocky.io/v2/5cc8019d300000980a055e76', (schema, request) => {
        console.log('Image uploaded');
        return new Response(
          201,
          {},
          {
            code: 201,
            msg: `image uploaded`,
            data: { url: 'this/is/the/img/url' },
          }
        );
      });
    },
  });

  return server;
}
