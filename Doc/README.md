# EduCore E-learning Dashboard

A modern, clean, and professional E-learning Web Application Dashboard built with React, NestJS, MySQL, and TypeORM.

## 📋 Project Overview

**EduCore** is a comprehensive e-learning management system with a focus on the Instructor/Admin dashboard. The application follows the **MVC (Model-View-Controller)** architecture pattern and uses **Giai Đoạn 1 (Mock Data Strategy)** for initial frontend development.

### Features:
- 📊 **Dashboard Statistics**: Total Revenue, Active Courses, Total Students, Average Rating
- 📈 **Revenue Analytics**: Monthly revenue charts and reports
- 📚 **Course Management**: Full CRUD operations for courses
- 👥 **User Management**: Students, Instructors, Admin roles
- 🔐 **Authentication**: JWT-based login/logout
- 🎯 **Advanced Filtering**: Filter courses by Topic and Level
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## 🏗️ Project Structure

```
my-elearning-app/
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── api/           # API layer (Axios)
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── mock/          # Mock data (Giai Đoạn 1)
│   │   ├── types/         # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/                # Backend (NestJS)
│   ├── src/
│   │   ├── common/        # Enums, constants
│   │   ├── modules/
│   │   │   ├── courses/   # Course Module
│   │   │   ├── users/     # User Module
│   │   │   ├── auth/      # Authentication Module
│   │   │   └── reports/   # Reports Module
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── DATABASE_SETUP.sql
│   └── .env.example
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites:
- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

### 1. Database Setup

```bash
# Connect to MySQL with root privileges
mysql -u root -p

# Run the database setup script
SOURCE /path/to/my-elearning-app/server/DATABASE_SETUP.sql;

# Verify:
USE ElearningDB;
SHOW TABLES;
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run start:dev
```

Server runs on: `http://localhost:3001`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📊 Development Phases

### Giai Đoạn 1: Frontend with Mock Data (CURRENT)
✅ Complete - Mock data is used for all API calls
- Dashboard with statistics
- Course management table
- Sidebar navigation
- Header with search and notifications

### Giai Đoạn 2: Database & Backend Core (IN PROGRESS)
- ✅ NestJS setup with TypeORM
- ✅ MySQL database configuration
- ✅ Entities and DTOs
- ✅ CRUD APIs for Courses
- ⏳ Additional modules (Students, Instructors, Reports)

### Giai Đoạn 3: Integration & Stored Procedures (PLANNED)
- Replace mock APIs with real backend calls
- Implement Stored Procedures
- Advanced reporting features

## 🔄 Transitioning from Mock to Real API

To switch from mock data to real API calls:

1. **In `client/src/api/courses.ts`**:
   - Uncomment the "GIAI ĐOẠN 2-3: REAL API" section
   - Comment out the exports pointing to demo functions
   - This will automatically use real API endpoints

2. **Ensure backend is running**:
   ```bash
   cd server
   npm run start:dev
   ```

3. **The application will automatically:**
   - Use `React Query` to manage API calls
   - Cache responses automatically
   - Handle loading and error states
   - Retry failed requests

## 🗄️ Database Schema

### Key Tables:
- **USERS**: User accounts (students, instructors, admins)
- **COURSES**: Course information
- **TOPICS**: Course topics/categories
- **SECTIONS**: Course sections
- **LECTURES**: Individual lectures
- **ENROLLMENTS**: Student course enrollments
- **TESTS**: Quizzes and tests
- **QUESTIONS**: Test questions
- **TRANSACTIONS**: Payment transactions
- **COURSE_INSTRUCTORS**: Course-Instructor relationships

## 🛠️ Technology Stack

### Frontend:
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool (fast, modern)
- **Ant Design**: UI component library
- **React Query (TanStack Query)**: Server state management
- **Axios**: HTTP client
- **React Router**: Client-side routing

### Backend:
- **NestJS**: Node.js framework
- **TypeORM**: ORM for database operations
- **MySQL**: Database
- **JWT**: Authentication
- **bcryptjs**: Password hashing

## 📝 API Endpoints

### Authentication
```
POST /api/auth/login              # Login
POST /api/auth/register           # Register
POST /api/auth/logout             # Logout
```

### Courses
```
GET  /api/courses                 # List all courses (paginated)
GET  /api/courses/:id             # Get course details
POST /api/courses                 # Create new course
PUT  /api/courses/:id             # Update course
DELETE /api/courses/:id           # Delete course
GET  /api/courses/topics          # Get all topics
```

### Reports
```
GET  /api/reports/dashboard-stats  # Dashboard statistics
GET  /api/reports/monthly-revenue  # Monthly revenue data
GET  /api/reports/course-stats     # Course statistics
```

## 🔐 Credentials

Default admin account (created during database setup):
- **Username**: admin_user
- **Email**: admin@example.com
- **Password**: (Set in DATABASE_SETUP.sql - change before production!)

## 📚 Component Documentation

### Frontend Components:

#### `Sidebar`
- Navigation menu
- Logo display
- User profile section
- Collapsible on mobile

#### `Header`
- Breadcrumb navigation
- Search bar
- Notification bell
- Create Course button

#### `StatisticsCard` & `StatisticsCards`
- Display KPI metrics
- Show trend indicators
- Responsive grid layout

#### `RevenueChart`
- Bar chart visualization
- Using Recharts library
- Monthly revenue display

#### `CourseTable`
- Paginated course list
- Filter by topic and level
- Action buttons (View, Edit, Delete)
- Responsive design

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=sManager
DB_PASSWORD=password123
DB_NAME=ElearningDB
JWT_SECRET=your-secret-key
PORT=3001
```

**Frontend (.env)**:
```
VITE_API_URL=http://localhost:3001/api
```

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
- Ensure MySQL is running
- Check DB credentials in .env
- Verify database exists

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
- Kill the process: `lsof -ti:3000 | xargs kill -9`
- Or change port in vite.config.ts or main.ts

### CORS Error
- Check CORS_ORIGIN in backend .env
- Ensure frontend URL matches

## 📖 Development Workflow

1. **Frontend First**: Design and test UI with mock data
2. **Backend Development**: Implement APIs in parallel
3. **Integration Testing**: Connect frontend to real APIs
4. **Database Optimization**: Add indexes, stored procedures
5. **Production Deployment**: Build and deploy both parts

## 🎓 Learning Resources

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Ant Design](https://ant.design)

## 📄 License

Private project - HCMUT Assignment

## 👨‍💻 Author

Stephen - HCMUT Student

---

**Last Updated**: December 2024
