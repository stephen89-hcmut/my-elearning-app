# API Danh sách & Cách gọi

Base URL: `http://localhost:3000`

## Auth

- `POST /auth/login`
  - Body: `{ "username": string, "password": string }`
  - Trả về: `{ access_token }`
  - cURL:
    ```bash
    curl -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d '{"username":"admin_hcmut","password":"password123"}'
    ```

- `POST /auth/register`
  - Body: CreateUserDto `{ username, email, firstName, lastName, password, role? }`
  - Trả về: token như login

- `POST /auth/logout`
  - Trả về: `{ message: 'Logged out' }`

## Courses

- `POST /courses`
  - Body: `CreateCourseDto` (courseName, description?, language, price, minScore?, level?, topicIds?)
  - Trả về: course

- `GET /courses`
  - Query: `page?`, `limit?` (mặc định 1/10)
  - Trả về: `{ data, total, page, limit, totalPages }`

- `GET /courses/topics`
  - Trả về: danh sách topics

- `GET /courses/:id`
  - Trả về: course theo id

- `GET /courses/:id/students`
  - Query: `page?`, `limit?`
  - Trả về: danh sách students của course

- `PUT /courses/:id`
  - Body: `UpdateCourseDto`
  - Trả về: course sau cập nhật

- `DELETE /courses/:id`
  - 204 No Content

## Users

- `GET /users/students`
  - Query: `page?`, `limit?`
  - Trả về: danh sách sinh viên (pagination)

## Reports

- `GET /reports/dashboard-stats`
  - Trả về: thống kê tổng quan (dashboard)

- `GET /reports/monthly-revenue`
  - Query: `month?`, `year?`
  - Trả về: doanh thu theo tháng

- `GET /reports/course-stats`
  - Trả về: thống kê khoá học

## Ghi chú

- Không có route `/`, nên gọi root sẽ 404 là đúng.
- DB kết nối theo `.env` (`BTL2` trên 192.168.1.200:3307). Đảm bảo server đang chạy `npm run start:dev` trước khi gọi API.
