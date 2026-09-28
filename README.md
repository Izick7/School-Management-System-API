# School Management System API

A REST API for managing a school: users and authentication, students, teachers,
classes, subjects and student results. Built with Node.js and Express.js using
in-memory arrays as the data store.

## Features

- JWT authentication with bcrypt-hashed passwords
- Three roles: `admin`, `teacher`, `student`
- Role-based access control on every route
- Student ownership checks so a student can only reach their own records
- Full CRUD for students, teachers, classes, subjects and results
- Server-side grade calculation from the score
- Request validation with `express-validator`
- Rate limiting on registration and login
- Request logging with method, URL, status code and timestamp
- Consistent JSON success and error responses
- Centralised error handling and JSON 404 responses

## Technologies

| Package               | Purpose                          |
| --------------------- | -------------------------------- |
| express                | HTTP server and routing          |
| bcrypt                 | Password hashing                 |
| jsonwebtoken           | JWT creation and verification    |
| express-validator      | Request validation               |
| express-rate-limit     | Brute-force protection           |
| dotenv                 | Environment variables            |
| nodemon                | Development auto-restart         |

CommonJS modules. No database.

## Project Structure

```text
src/
├── controllers/
│   ├── authController.js
│   ├── classController.js
│   ├── resultController.js
│   ├── studentController.js
│   ├── subjectController.js
│   └── teacherController.js
├── routes/
│   ├── authRoutes.js
│   ├── classRoutes.js
│   ├── resultRoutes.js
│   ├── studentRoutes.js
│   ├── subjectRoutes.js
│   └── teacherRoutes.js
├── middleware/
│   ├── auth.js            # verifies the JWT and sets req.user
│   ├── authorize.js       # checks req.user.role against allowed roles
│   ├── errorHandler.js    # central error handler (last in app.js)
│   ├── loadStudent.js     # resolves req.user.id to req.student
│   ├── logger.js          # request logging
│   ├── rateLimiter.js     # rate limiters
│   └── validate.js        # runs express-validator results
├── validators/
│   ├── authValidator.js
│   ├── classValidator.js
│   ├── commonValidator.js
│   ├── resultValidator.js
│   ├── studentValidator.js
│   ├── subjectValidator.js
│   └── teacherValidator.js
├── utils/
│   ├── calculateGrade.js
│   └── generateId.js
├── data/
│   ├── classes.js
│   ├── results.js
│   ├── seed.js
│   ├── students.js
│   ├── subjects.js
│   ├── teachers.js
│   └── users.js
├── app.js
└── server.js
```

### Request flow

```text
request
  -> express.json() body parser
  -> logger
  -> route
       -> authenticate        (401 if no/invalid token)
       -> authorize(roles)    (403 if role not allowed)
       -> validators          (400 if invalid)
       -> validate
       -> controller          (404/409 for domain errors)
  -> JSON 404 handler
  -> errorHandler
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=1h
ADMIN_EMAIL=admin@school.com
ADMIN_PASSWORD=choose_a_strong_admin_password
```

| Variable           | Required | Description                                     |
| ------------------ | -------- | ----------------------------------------------- |
| `PORT`             | No       | Server port. Defaults to `5000`.                |
| `JWT_SECRET`       | Yes      | Secret used to sign and verify tokens.          |
| `JWT_EXPIRES_IN`   | Yes      | Token lifetime, e.g. `1h` or `7d`.              |
| `ADMIN_EMAIL`      | Yes      | Email of the admin seeded on startup.           |
| `ADMIN_PASSWORD`   | Yes      | Password of the admin seeded on startup.        |

`.env` is listed in `.gitignore` and must never be committed. Never commit real
secrets; use your own values locally.

## Running the Server

```bash
npm start     # node src/server.js
npm run dev   # nodemon src/server.js
```

On startup the server seeds one admin account using `ADMIN_EMAIL` and
`ADMIN_PASSWORD`. Confirm it is running:

```bash
curl http://localhost:5000/
```

```json
{
  "success": true,
  "message": "School Management API is running"
}
```

## Authentication

Registration always creates a `student`. A `role` supplied in the request body is
ignored, so nobody can promote themselves to admin.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@school.com","password":"secret123"}'
```

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "0f1c...",
    "name": "Ada Lovelace",
    "email": "ada@school.com",
    "role": "student"
  }
}
```

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@school.com","password":"secret123"}'
```

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "0f1c...",
      "name": "Ada Lovelace",
      "email": "ada@school.com",
      "role": "student"
    }
  }
}
```

Send the token on every protected request:

```text
Authorization: Bearer <token>
```

## Roles and Permissions

| Endpoint                                   | admin | teacher | student        |
| ------------------------------------------ | :---: | :-----: | :------------: |
| `POST /api/auth/register`                  |       |         | (public)       |
| `POST /api/auth/login`                     |       |         | (public)       |
| `POST /api/classes`                        |   Y   |         |                |
| `GET /api/classes`                         |   Y   |    Y    |      Y         |
| `GET /api/classes/:id`                     |   Y   |    Y    |      Y         |
| `PUT /api/classes/:id`                     |   Y   |         |                |
| `DELETE /api/classes/:id`                  |   Y   |         |                |
| `POST /api/students`                       |   Y   |         |                |
| `GET /api/students`                        |   Y   |    Y    |                |
| `GET /api/students/me`                     |   Y   |    Y    |      Y         |
| `GET /api/students/me/class`               |   Y   |    Y    |      Y         |
| `GET /api/students/:id`                    |   Y   |    Y    |                |
| `PUT /api/students/:id`                    |   Y   |         |                |
| `DELETE /api/students/:id`                 |   Y   |         |                |
| `POST /api/teachers`                       |   Y   |         |                |
| `GET /api/teachers`                        |   Y   |    Y    |                |
| `GET /api/teachers/:id`                    |   Y   |    Y    |                |
| `PUT /api/teachers/:id`                    |   Y   |         |                |
| `DELETE /api/teachers/:id`                 |   Y   |         |                |
| `POST /api/subjects`                       |   Y   |         |                |
| `GET /api/subjects`                        |   Y   |    Y    |      Y         |
| `GET /api/subjects/:id`                    |   Y   |    Y    |      Y         |
| `PUT /api/subjects/:id`                    |   Y   |         |                |
| `DELETE /api/subjects/:id`                 |   Y   |         |                |
| `POST /api/results`                        |   Y   |    Y    |                |
| `GET /api/results`                         |   Y   |    Y    |                |
| `GET /api/results/me`                      |   Y   |    Y    |      Y         |
| `GET /api/results/:id`                     |   Y   |    Y    |                |
| `PUT /api/results/:id`                     |   Y   |    Y    |                |
| `DELETE /api/results/:id`                  |   Y   |         |                |

`/me` routes return only the caller's own records. They use the authenticated
user id from the JWT, never a client-supplied id, so a student cannot reach
another student's profile or results by changing an id in the URL. Calling
`/me` without a linked student profile returns `403`.

Students are read-only. They cannot create, update or delete any school record.

## Data Models

```text
User     { id, name, email, passwordHash, role, createdAt }
Student  { id, name, email, phone, classId, userId, createdAt }
Teacher  { id, name, email, phone, subjectId, userId, createdAt }
Class    { id, name, level, createdAt }
Subject  { id, name, code, createdAt }
Result   { id, studentId, subjectId, score, grade, term, session, createdAt }
```

Relationships:

```text
Student.classId   -> Class.id
Student.userId    -> User.id
Teacher.subjectId -> Subject.id
Teacher.userId    -> User.id
Result.studentId  -> Student.id
Result.subjectId  -> Subject.id
```

A student account is created by registering, then an admin creates the matching
student profile with the `userId` from that registration. A teacher account is
created by the admin through `POST /api/teachers` (see below).

## API Endpoints

### Auth

| Method | Path                 | Access |
| ------ | -------------------- | ------ |
| POST   | `/api/auth/register` | Public |
| POST   | `/api/auth/login`    | Public |

### Classes

| Method | Path                 | Access           |
| ------ | -------------------- | ---------------- |
| POST   | `/api/classes`       | admin            |
| GET    | `/api/classes`       | admin, teacher, student |
| GET    | `/api/classes/:id`   | admin, teacher, student |
| PUT    | `/api/classes/:id`   | admin            |
| DELETE | `/api/classes/:id`   | admin            |

```json
// POST /api/classes
{ "name": "JSS1 Gold", "level": "JSS1" }

// Response
{
  "success": true,
  "message": "Class created successfully",
  "data": {
    "id": "1a2b...",
    "name": "JSS1 Gold",
    "level": "JSS1",
    "createdAt": "2026-09-28T09:00:00.000Z"
  }
}
```

A class with the same `name` and `level` already returns `409`.

### Students

| Method | Path                    | Access           |
| ------ | ----------------------- | ---------------- |
| POST   | `/api/students`         | admin            |
| GET    | `/api/students`         | admin, teacher   |
| GET    | `/api/students/me`      | any authenticated |
| GET    | `/api/students/me/class`| any authenticated |
| GET    | `/api/students/:id`     | admin, teacher   |
| PUT    | `/api/students/:id`     | admin            |
| DELETE | `/api/students/:id`     | admin            |

```json
// POST /api/students
{
  "name": "Ada Lovelace",
  "email": "ada@school.com",
  "phone": "08012345678",
  "classId": "1a2b...",
  "userId": "0f1c..."
}
```

All fields are required. The `classId` must match an existing class and the
`userId` an existing user, otherwise the response is `404`. Only one student
profile may exist per `userId`; a second attempt returns `409`.

```bash
curl http://localhost:5000/api/students/me \
  -H "Authorization: Bearer <student token>"
```

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "3c4d...",
    "name": "Ada Lovelace",
    "email": "ada@school.com",
    "phone": "08012345678",
    "classId": "1a2b...",
    "userId": "0f1c...",
    "createdAt": "2026-09-28T09:05:00.000Z"
  }
}
```

### Teachers

| Method | Path                 | Access         |
| ------ | -------------------- | -------------- |
| POST   | `/api/teachers`      | admin          |
| GET    | `/api/teachers`      | admin, teacher |
| GET    | `/api/teachers/:id`  | admin, teacher |
| PUT    | `/api/teachers/:id`  | admin          |
| DELETE | `/api/teachers/:id`  | admin          |

```json
// POST /api/teachers  (creates the teacher profile and a login account)
{
  "name": "Alan Turing",
  "email": "alan@school.com",
  "phone": "08098765432",
  "subjectId": "9f8e...",
  "password": "teach123"
}
```

`subjectId` must match an existing subject, otherwise `404`.

There are two ways to supply the login account:

- **Send `password` and omit `userId`** (shown above). The API creates a user
  with the role `teacher` and links it. This is the usual path.
- **Send an existing `userId`** to attach a teacher profile to a user that
  already exists. That user must not already have a teacher profile, otherwise
  `409`. The supplied `email` and `phone` are stored on the teacher record.

Passwords are hashed with bcrypt before storage and are never returned. Sending
`password` without `userId` and without a valid `userId` fails with `400` if the
password is missing.

### Subjects

| Method | Path                 | Access                   |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/subjects`      | admin                    |
| GET    | `/api/subjects`      | admin, teacher, student  |
| GET    | `/api/subjects/:id`  | admin, teacher, student  |
| PUT    | `/api/subjects/:id`  | admin                    |
| DELETE | `/api/subjects/:id`  | admin                    |

```json
// POST /api/subjects
{ "name": "Mathematics", "code": "MATH101" }
```

`code` is stored in uppercase, may contain only letters, numbers and hyphens,
and must be unique. A duplicate code returns `409`.

```json
{
  "success": true,
  "message": "Subject created successfully",
  "data": {
    "id": "9f8e...",
    "name": "Mathematics",
    "code": "MATH101",
    "createdAt": "2026-09-28T09:02:00.000Z"
  }
}
```

### Results

| Method | Path                 | Access           |
| ------ | -------------------- | ---------------- |
| POST   | `/api/results`       | admin, teacher   |
| GET    | `/api/results`       | admin, teacher   |
| GET    | `/api/results/me`    | any authenticated |
| GET    | `/api/results/:id`   | admin, teacher   |
| PUT    | `/api/results/:id`   | admin, teacher   |
| DELETE | `/api/results/:id`   | admin            |

```json
// POST /api/results
{
  "studentId": "3c4d...",
  "subjectId": "9f8e...",
  "score": 85,
  "term": "Term 1",
  "session": "2025/2026"
}
```

`studentId` must match an existing student and `subjectId` an existing subject,
otherwise `404`. `score` must be a number between `0` and `100`.

`grade` is calculated on the server from `score` and is never taken from the
request body. Updating a score recalculates the grade.

| Score  | Grade |
| ------ | ----- |
| 70-100 | A     |
| 60-69  | B     |
| 50-59  | C     |
| 45-49  | D     |
| 40-44  | E     |
| 0-39   | F     |

A result for the same `studentId`, `subjectId`, `term` and `session` already
existing returns `409`.

```json
{
  "success": true,
  "message": "Result created successfully",
  "data": {
    "id": "7a6b...",
    "studentId": "3c4d...",
    "subjectId": "9f8e...",
    "score": 85,
    "grade": "A",
    "term": "Term 1",
    "session": "2025/2026",
    "createdAt": "2026-09-28T09:10:00.000Z"
  }
}
```

## Response Format

Success:

```json
{ "success": true, "message": "...", "data": {} }
```

Error:

```json
{ "success": false, "message": "..." }
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

Validation errors list only the field name and the message. Submitted values are
never echoed back, so a failed check cannot leak a password.

## Validation Behavior

| Rule                | Applies to                              | Response |
| ------------------- | --------------------------------------- | -------- |
| Required field      | all create/update payloads              | 400      |
| Valid email         | register, login, student, teacher       | 400      |
| Phone 7-15 chars    | student, teacher                        | 400      |
| Score 0-100 numeric | results                                 | 400      |
| Non-empty string id | `classId`, `userId`, `subjectId`, `studentId`, `:id` | 400 |
| Unique code         | subjects                                | 409      |
| Unique name+level   | classes                                 | 409      |
| Unique userId       | student, teacher profiles               | 409      |
| Unknown `classId`   | student, result                         | 404      |
| Unknown `subjectId` | teacher, result                         | 404      |
| Unknown `studentId` | result                                  | 404      |
| Unknown `userId`    | student, teacher                        | 404      |

Strings are trimmed and subject codes are uppercased before storage. Fields are
optional on `PUT` and only the fields you send are updated. Unknown fields in a
request body are ignored rather than rejected.

## Error Handling

| Status | Meaning                                                          |
| ------ | ---------------------------------------------------------------- |
| 200    | Success                                                          |
| 201    | Created                                                         |
| 400    | Validation failed                                                |
| 401    | No token, invalid token, or expired token                       |
| 403    | Authenticated but not allowed (wrong role, or not your record)  |
| 404    | Resource does not exist, or unknown route                       |
| 409    | Duplicate record                                                |
| 429    | Rate limit exceeded                                             |
| 500    | Unexpected server error                                         |

`401` means "we do not know who you are". `403` means "we know who you are and
you are not allowed".

Unhandled errors are logged to the console and returned as a generic
`Internal server error`, so stack traces and internal details are never sent to
the client. Unknown routes return a JSON `404`.

## Rate Limiting

`POST /api/auth/register` and `POST /api/auth/login` are limited to **20 requests
per 15 minutes per IP address**. This slows down brute-force login attempts and
automated sign-up abuse.

The limit is focused on the auth routes only; data routes are not rate limited so
normal usage is not interrupted. Because the counter lives in server memory, a
restart clears it.

Exceeding the limit returns `429`:

```json
{
  "success": false,
  "message": "Too many attempts, please try again later"
}
```

## Request Logging

Every request is logged once it finishes, so the recorded status code is the
final response status.

```text
2026-09-28T09:08:47.007Z GET / 200 20ms
2026-09-28T09:08:47.126Z POST /api/auth/login 401 62ms
```

Bodies, passwords, tokens and hashes are never logged.

## Testing

Test with Thunder Client or `curl`. A useful order:

1. `npm run dev`
2. `POST /api/auth/login` with the admin from `.env`, save the token as
   `{{adminToken}}`.
3. `POST /api/auth/register` to create a student, save that token as
   `{{studentToken}}`.
4. Create a subject, then a class, then attach the student profile.
5. Create a teacher, which also creates a teacher login.
6. Add a result and read it back with `GET /api/results/me` as the student.

Using Thunder Client environment variables keeps the tokens out of individual
requests.

### Checks worth making by hand

```text
No token                     -> 401
Invalid or expired token     -> 401
Student token on an admin
  route                      -> 403
Student reads another
  student's profile by id    -> 403
Student reads all results    -> 403
Missing required field       -> 400
Invalid email                -> 400
Score of 150 or -5           -> 400
Unknown classId/subjectId/
  studentId                  -> 404
Duplicate code / userId      -> 409
Wrong password on login      -> 401
Grade of 85                  -> A
Unknown route                -> 404 (JSON)
11th login in 15 minutes     -> 429
```

To verify the rate limiter, restart the server first, then call
`POST /api/auth/login` more than 20 times in 15 minutes.

## Important Note

**All data is stored in memory.** There is no database. Every record lives in a
plain JavaScript array that is created empty when the process starts.

This means:

- Restarting the server (`npm run dev` reload, or `npm start`) **wipes all
  data**, including users, students, teachers, classes, subjects and results.
- The admin account is re-seeded on every start; other records are not.
- Data is not shared between processes or machines.

This is intentional for the assessment. To test cleanly, restart the server and
recreate your data.

## Security Summary

- Passwords are hashed with bcrypt (cost 10) and never stored in plaintext.
- Password hashes are never included in any API response.
- JWTs are signed with `JWT_SECRET` from `.env`; no secret is hardcoded.
- `role` is always assigned server-side on registration and cannot be supplied
  by the client.
- Every route except register and login requires a valid token.
- Ownership is derived from the authenticated user id in the JWT, so a student
  cannot access another student's data by changing an id.
- Validation errors report field names and messages only, never values.
- `.env` and `node_modules/` are excluded from version control.
