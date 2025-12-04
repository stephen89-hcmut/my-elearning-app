# 🚀 EduCore - Quick Start Guide

## Overview
This is a complete monorepo e-learning dashboard built with:
- **Frontend**: React 18 + TypeScript + Vite + Ant Design
- **Backend**: NestJS + TypeORM + MySQL
- **Strategy**: Giai Đoạn 1 (Mock Data First) → Real API Integration

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Database Setup (Terminal 1)
```powershell
# Open MySQL
mysql -u root -p

# In MySQL prompt:
USE mysql;
CREATE USER 'sManager'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'sManager'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Create database
mysql -u sManager -p'password123' -e "CREATE DATABASE ElearningDB;"

# Import schema (from server folder)
mysql -u sManager -p'password123' ElearningDB < DATABASE_SETUP.sql
```

### Step 2: Backend Setup (Terminal 2)
```powershell
cd server
npm install
# Edit .env if needed (defaults work fine)
npm run start:dev
# Server runs on http://localhost:3001
```

### Step 3: Frontend Setup (Terminal 3)
```powershell
cd client
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

✅ You're ready! Open http://localhost:3000 in your browser.

---

## 📊 What You'll See

### Dashboard Page (`http://localhost:3000/`)
- 4 Statistics Cards showing:
  - Total Revenue: $12,450
  - Total Courses: 24 Active
  - Total Students: 1,203
  - Avg Rating: 4.8/5.0
- Monthly Revenue Bar Chart
- Course Management Table with filters

### Features to Try:
1. **Filter Courses**: Select Topic and Level dropdowns
2. **View/Edit/Delete**: Action buttons on table rows
3. **Sidebar**: Navigate between pages (mock data for now)
4. **Create Course**: Click button in header
5. **Search**: Search bar in header

---

## 📁 File Structure Explained

```
client/
├── src/
│   ├── api/
│   │   └── courses.ts       # API layer (uses mock for now)
│   ├── components/
│   │   ├── Sidebar.tsx      # Navigation
│   │   ├── Header.tsx       # Top bar
│   │   ├── StatisticsCard.tsx
│   │   ├── RevenueChart.tsx
│   │   └── CourseTable.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── CoursesPage.tsx  # Course management
│   │   └── StudentsPage.tsx # Placeholder
│   ├── mock/
│   │   └── courses.ts       # Mock data (Giai Đoạn 1)
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point

server/
├── src/
│   ├── common/enums/        # Enums (UserRole, CourseLevel)
│   ├── modules/
│   │   ├── courses/         # Course Module (CRUD APIs)
│   │   ├── users/           # User Module
│   │   ├── auth/            # Auth Module (Login/Register)
│   │   └── reports/         # Reports Module (Stored Procedures)
│   ├── app.module.ts        # Main module
│   └── main.ts              # Entry point
└── DATABASE_SETUP.sql       # Database creation script
```

---

## 🔄 API Endpoints (Backend Ready)

All endpoints are **mock-ready** on frontend for now:

```
GET    /api/courses                    # List courses (paginated)
GET    /api/courses/:id                # Get course details
POST   /api/courses                    # Create course
PUT    /api/courses/:id                # Update course
DELETE /api/courses/:id                # Delete course

GET    /api/courses/topics             # Get all topics

GET    /api/reports/dashboard-stats    # Dashboard stats
GET    /api/reports/monthly-revenue    # Monthly revenue

POST   /api/auth/login                 # Login
POST   /api/auth/register              # Register
POST   /api/auth/logout                # Logout
```

---

## 💾 Mock Data

Mock data is located in `client/src/mock/courses.ts`:

```typescript
mockCourses = [
  {
    courseId: 101,
    courseName: 'Introduction to Database Systems',
    price: 19.99,
    level: CourseLevel.BEGINNER,
    instructors: [{ ... }],
    topics: [{ topicId: 1, topicName: 'Computer Science' }]
  },
  // ... more courses
]
```

To add more mock data, edit this file directly.

---

## 🔌 Switching to Real API (When Backend is Ready)

### Step 1: Uncomment Real API in `client/src/api/courses.ts`
```typescript
// Currently commented out, uncomment these:
export const getCourses = async (page, limit, topic, level) => {
  const res = await axios.get(`${API_BASE}/courses`, {
    params: { page, limit, topic, level }
  });
  return res.data;
};
```

### Step 2: Comment out Mock exports
```typescript
// Comment out:
export const getCourses = getCoursesDemo;
```

### Step 3: Restart frontend
```powershell
npm run dev
```

✅ Frontend will now use real API calls!

---

## 📋 Database Tables Overview

| Table | Purpose |
|-------|---------|
| USERS | User accounts |
| STUDENTS | Student-specific info |
| INSTRUCTORS | Instructor-specific info |
| ADMINS | Admin-specific info |
| COURSES | Course information |
| TOPICS | Course topics |
| COURSE_TOPICS | Course-Topic mapping |
| COURSE_INSTRUCTORS | Course-Instructor mapping |
| SECTIONS | Course sections |
| LECTURES | Individual lectures |
| ENROLLMENTS | Student enrollments |
| TESTS | Quizzes |
| QUESTIONS | Test questions |
| TRANSACTIONS | Payment transactions |

---

## 🧪 Testing the Dashboard

### 1. View Mock Data
```
✓ Dashboard shows 4 statistics cards
✓ Revenue chart displays 12 months
✓ Course table shows 4 sample courses
✓ Pagination shows "Showing 1-4 of 4"
```

### 2. Test Filters
```
✓ Filter by Topic: Select "Computer Science"
✓ Filter by Level: Select "Advanced"
✓ Filters work together
```

### 3. Test Table Actions
```
✓ Eye icon: Shows course details
✓ Edit icon: Opens edit form
✓ Delete icon: Shows confirmation
```

### 4. Test Sidebar Navigation
```
✓ Dashboard (Active)
✓ Courses Management
✓ Students (Coming soon)
✓ Instructors (Coming soon)
✓ Reports (Coming soon)
✓ Settings (Coming soon)
```

---

## 🐛 Troubleshooting

### Frontend won't start
```
Error: EADDRINUSE: address already in use :::3000

Solution:
# PowerShell:
Get-Process -Name node | Stop-Process -Force
# Then: npm run dev
```

### Backend won't start
```
Error: connect ECONNREFUSED 127.0.0.1:3306

Solution:
1. Check MySQL is running: mysql -u root -p
2. Check .env credentials
3. Create database: mysql -u sManager -p'password123' < DATABASE_SETUP.sql
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution: Backend already configured for http://localhost:3000
If still issues, check CORS_ORIGIN in server/.env
```

### Module not found
```
Error: Cannot find module '@/types'

Solution:
1. Clear node_modules: rm -r node_modules
2. Reinstall: npm install
3. Restart server: npm run dev
```

---

## 📚 Next Steps (Giai Đoạn 2 & 3)

### Giai Đoạn 2: Connect to Real Database
- ✅ Database schema ready (DATABASE_SETUP.sql)
- ✅ Entities and DTOs ready
- ✅ Services and Controllers ready
- 🚧 Add sample data to database
- 🚧 Test each API endpoint

### Giai Đoạn 3: Advanced Features
- 🚧 Stored Procedures (sp_GetMonthlyRevenue)
- 🚧 Student/Instructor management
- 🚧 Payment transactions
- 🚧 Advanced reporting

---

## 💡 Tips & Tricks

### 1. Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes auto-reflect
- Backend: Changes auto-reflect (NestJS watch mode)

### 2. Debug Mode
Frontend:
```javascript
// In browser console
localStorage.setItem('debug', 'true')
```

Backend:
```bash
npm run start:debug
# Then attach debugger in VS Code
```

### 3. View Database
```powershell
mysql -u sManager -p'password123' ElearningDB
SHOW TABLES;
SELECT * FROM COURSES;
```

---

## 📞 Support

For issues, check:
1. MySQL is running
2. Correct credentials in .env
3. All npm packages installed
4. No ports in use (3000, 3001, 3306)
5. Database exists and has tables

---

## 🎉 You're All Set!

Navigate to http://localhost:3000 and start exploring EduCore!

Questions? Check:
- `/my-elearning-app/README.md` - Full documentation
- `server/DATABASE_SETUP.sql` - Database schema
- `client/src/mock/courses.ts` - Sample data structure

**Happy Coding! 🚀**
