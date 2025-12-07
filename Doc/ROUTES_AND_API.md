# Routes & API Endpoints

This file lists frontend page routes and backend REST endpoints used in the project.

## Frontend Routes (React Router)
All routes are defined in `client/src/App.tsx` (protected via auth except `/login`).
- `/login` – Login page.
- `/` – Dashboard (default under protected layout).
- `/courses` – Courses list.
- `/courses/:id` – Course detail page.
- `/students` – Students list.
- `/students/:id` – Student detail page.
- `/instructors` – Instructors list.
- `/instructors/:id` – Instructor detail page.

## Backend API (NestJS, base path `/api`)
Endpoints below assume the server is mounted at `/api` (see client `VITE_API_URL`).

### Auth (`/api/auth`)
- `POST /auth/login` – Login with `{ username, password }`, returns JWT.
- `POST /auth/register` – Register user (CreateUserDto), returns JWT.
- `POST /auth/logout` – Placeholder logout (stateless JWT).

### Courses (`/api/courses`)
- `GET /courses?page&limit` – List courses with pagination.
- `POST /courses` – Create course.
- `GET /courses/:id` – Get course by id.
- `GET /courses/:id/detail` – Course detail (aggregated info).
- `GET /courses/:id/students?page&limit` – Students enrolled in a course.
- `PUT /courses/:id` – Update course.
- `DELETE /courses/:id` – Delete course.

### Users / Students & Instructors (`/api/users`)
- `GET /users/students?page&limit` – List students.
- `GET /users/students/:id` – Student detail.
- `PUT /users/students/:id` – Update student.
- `DELETE /users/students/:id` – Delete student.
- `GET /users/instructors?page&limit` – List instructors.
- `GET /users/instructors/:id` – Instructor detail.
- `PUT /users/instructors/:id` – Update instructor.
- `DELETE /users/instructors/:id` – Delete instructor.

### Students (direct controller) (`/api/students`)
- `GET /students/:id` – Student detail.
- `PUT /students/:id` – Update student.
- `DELETE /students/:id` – Delete student.

### Reports (`/api/reports`)
- `GET /reports` – Dashboard summary (total revenue, counts, avg rating).
- `GET /reports/dashboard-stats` – Alias for dashboard summary.
- `GET /reports/statistics` – Alias for dashboard summary.
- `GET /reports/monthly-revenue?month&year` – Monthly revenue metrics.
- `GET /reports/course-stats` – Course statistics.

## Notes
- Auth-protected routes/pages expect a valid JWT in `Authorization: Bearer <token>` (handled client-side via Axios interceptor).
- Client base URL is configured via `client/.env` (`VITE_API_URL`). Update this if the backend host/port changes.
- Some controllers expose overlapping student endpoints under both `/users` and `/students`; client currently uses `/users/*` endpoints for list/detail/update/delete.
