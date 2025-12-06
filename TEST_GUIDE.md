# ✅ QUICK TEST GUIDE - All Mockups

## Test Scenarios

### 1️⃣ Login (Mockup 1)
```
Step 1: Open http://localhost:3001
Step 2: See EduCore login page with:
  ✅ Logo and title "EduCore"
  ✅ Username input
  ✅ Password input
  ✅ "Sign In" button
  ✅ Demo Account section
  ✅ "Use Demo Account" button

Step 3: Click "Use Demo Account"
  ✅ Form auto-fills: sManager / password123

Step 4: Click "Sign In"
  ✅ Success notification appears
  ✅ Redirected to Dashboard
  ✅ User profile shows "Quản Lý" (Admin) in sidebar
```

### 2️⃣ Create New Course Modal (Mockups 2-3)
```
Step 1: Go to "Courses Management"
Step 2: Click "Create Course" button
  ✅ Modal appears titled "Create New Course"

Step 3: Leave form empty, click "Create Course"
  ✅ Red error message: "Course name is required"
  ✅ Red error message: "Please select an instructor"
  ✅ Red error message: "Please select language"
  ✅ Red error message: "Minimum Score for Certificate (0-100)"
  ✅ Red error message: "Please select at least one topic"

Step 4: Fill form correctly:
  - Course Name: "Advanced Python Programming"
  - Description: "Learn advanced Python concepts"
  - Instructor: "Nguyen Minh Tan"
  - Language: "Vietnamese"
  - Price: 49.99
  - Level: "Advanced"
  - Min Score: 70
  - Topics: Check "Computer Science" and "IT & Software"

Step 5: Click "Create Course"
  ✅ Modal closes
  ✅ Success notification: "Course created successfully"
  ✅ New course appears in table
```

### 3️⃣ Course Detail Modal (Mockup 4)
```
Step 1: In Courses Management table
Step 2: Click eye icon (view) on any course
  ✅ Modal shows: "Introduction to Database Systems"
  ✅ Tags show: Level (Beginner), Language (Vietnamese), Rating (⭐ 4.8)

Step 3: See course details:
  ✅ Course ID: #101
  ✅ Total Lectures: 24
  ✅ Price: $19.99
  ✅ Min Score: 50%
  ✅ Students: 1203
  ✅ Description text

Step 4: See Topics section
  ✅ Shows as blue tags: "Computer Science", "IT & Software"

Step 5: See Instructor section
  ✅ Instructor name: "Nguyen Minh Tan"
  ✅ Email, Teaching Field, Hourly Rate

Step 6: Footer buttons
  ✅ "Close" button (closes modal)
  ✅ "Edit" button (blue)
  ✅ "Delete" button (red)
```

### 4️⃣ Edit Course (Reuse Modal)
```
Step 1: In Course Detail Modal
Step 2: Click "Edit" button
  ✅ Modal title changes to "Edit Course"
  ✅ Form pre-fills with current data
  ✅ Button changes to "Update Course"

Step 3: Change a field
  - Price: 24.99 → 29.99

Step 4: Click "Update Course"
  ✅ Modal closes
  ✅ Success notification: "Course updated successfully"
  ✅ Table shows updated price
```

### 5️⃣ Delete with Confirmation (Mockup)
```
Step 1: In Course Detail Modal
Step 2: Click "Delete" button
  ✅ Popconfirm dialog appears

Step 3: See confirmation dialog:
  ✅ Title: "Delete Course"
  ✅ Message: "Are you sure you want to delete "Introduction to Database Systems"?"
  ✅ Message: "This action cannot be undone."

Step 4: Click "Yes, Delete"
  ✅ Dialog closes
  ✅ Success notification: "Course deleted successfully"
  ✅ Course removed from table

Step 5: Click "Delete" again, then "Cancel"
  ✅ Dialog closes without deleting
```

### 6️⃣ Students Page (Mockup 6)
```
Step 1: Click "Students" in sidebar
Step 2: See Statistics Cards:
  ✅ Total Students: 10
  ✅ Active Students: 9
  ✅ Avg Courses/Student: 2.7
  ✅ Completion Rate: 30%

Step 3: See "Student List" table with columns:
  ✅ ID (#1-#10)
  ✅ Student Name with avatar
  ✅ Email with link
  ✅ Enrollment Date
  ✅ Courses (as tag)
  ✅ Progress (progress bar)
  ✅ Status (Active/Inactive, color-coded)

Step 4: Test search:
  - Type "tran" in search
  ✅ Shows only "Tran Van Long"
  - Type "mai.nguyen"
  ✅ Shows "Nguyen Thi Mai"
  - Clear search
  ✅ Shows all 10 students again

Step 5: Pagination
  ✅ Shows "1-10 of 10"
  ✅ Can change page size
```

### 7️⃣ Instructors Page (Mockup 7)
```
Step 1: Click "Instructors" in sidebar
Step 2: See Statistics Cards:
  ✅ Total Instructors: 5
  ✅ Total Courses: 9
  ✅ Total Revenue: $20,771.00
  ✅ Avg Rating: 4.7

Step 3: See Instructor List Table:
  ✅ ID (#1-#5)
  ✅ Instructor Name with avatar
  ✅ Email with link
  ✅ Teaching Field
  ✅ Courses count
  ✅ Students count
  ✅ Revenue (green)
  ✅ Rating (with star)

Step 4: Test search:
  - Type "pham"
  ✅ Shows "Pham Thi Hoa"
  - Type "web"
  ✅ Shows "Pham Thi Hoa" (Web Development)

Step 5: See Instructor Cards Section:
  ✅ Beautiful gradient backgrounds
  ✅ Large avatars
  ✅ Name and username
  ✅ Teaching field
  ✅ Stats (Courses, Students, Revenue, Rating)
  ✅ 3 cards per row (responsive)
```

### 8️⃣ Sidebar & Navigation (Mockup 8)
```
Step 1: Check Sidebar:
  ✅ "EduCore" logo at top
  ✅ Navigation items:
    - Dashboard
    - Courses Management
    - Students
    - Instructors
    - Reports
    - Settings

Step 2: Check User Profile at bottom:
  ✅ Avatar with "MS" (Minh, Sung)
  ✅ Name: "Quản Lý" (Admin)
  ✅ Role: "admin"
  ✅ Logout button

Step 3: Test Logout:
  - Click "Logout" button
  ✅ Confirmation dialog: "Are you sure you want to logout?"
  - Click "Yes"
  ✅ Success notification: "Logged out successfully"
  ✅ Redirected to login page

Step 4: Test Navigation:
  - Click "Courses Management"
  ✅ Navigates to courses page
  ✅ Active item highlighted in sidebar

Step 5: Collapse Sidebar:
  - Click collapse button
  ✅ Sidebar collapses
  ✅ Logo shows "EC"
  ✅ Icons only visible
  - Click again
  ✅ Sidebar expands
```

### 🎯 Form Validation Tests
```
1. Course Form - Empty Fields:
   ✅ Shows red errors for all required fields

2. Course Form - Invalid Ranges:
   - Price: Negative value
   ✅ Error: "Price must be greater than or equal to 0"
   - Min Score: 150
   ✅ Error: "Score must be between 0 and 100"

3. Course Form - Min Length:
   - Course Name: "AB"
   ✅ Error: "Course name must be at least 3 characters"

4. Course Form - Multi-Select:
   - Uncheck all topics, try to submit
   ✅ Error: "Please select at least one topic"
```

### 📱 Responsive Tests
```
1. Mobile (375px width):
   ✅ Sidebar collapses automatically
   ✅ Cards stack vertically
   ✅ Tables scroll horizontally
   ✅ Modals fit screen

2. Tablet (768px width):
   ✅ 2-column layouts work
   ✅ Sidebar can collapse
   ✅ Tables display normally

3. Desktop (1920px width):
   ✅ 3+ column layouts work
   ✅ Full sidebar always visible
   ✅ All content displays properly
```

### ✨ Extra Features
```
1. Real-time Search:
   ✅ Students: Type to filter by name/email
   ✅ Instructors: Type to filter by name/email

2. Success Notifications:
   ✅ Create course
   ✅ Update course
   ✅ Delete course
   ✅ Login success
   ✅ Logout success

3. Protected Routes:
   - Go directly to http://localhost:3001/courses
   ✅ Redirects to /login
   - Login
   ✅ Can access /courses

4. Data Persistence:
   ✅ Login state persists in localStorage
   ✅ Page refresh keeps user logged in
```

---

## 🐛 Troubleshooting

### Issue: Cannot login
- Try credentials: `sManager` / `password123`
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`

### Issue: Modals not appearing
- Check browser console for React errors
- Ensure Ant Design is installed: `npm install antd`

### Issue: Styles look different
- Hard refresh browser: `Ctrl+F5`
- Clear browser cache
- Rebuild: `npm run build`

### Issue: Search not working
- Check mock data is loaded
- Type slowly, search is real-time
- Check browser console

---

## ✅ Success Checklist

- [x] Login page matches mockup 1
- [x] Course form modal matches mockup 2-3
- [x] Validation shows red errors
- [x] Course detail modal matches mockup 4
- [x] Delete confirmation works
- [x] Students page matches mockup 6
- [x] Statistics cards show correct numbers
- [x] Search functionality works
- [x] Instructors page matches mockup 7
- [x] Instructor cards display correctly
- [x] Sidebar matches mockup 8
- [x] Logout confirmation works
- [x] All notifications appear
- [x] Forms validate correctly
- [x] No TypeScript errors
- [x] Responsive design works
- [x] Protected routes work
- [x] Mock data displays correctly

**Status: ✅ ALL MOCKUPS IMPLEMENTED & READY TO TEST**
