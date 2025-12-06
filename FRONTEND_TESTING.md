# Frontend Testing Guide

## Quick Start

### 1. Start Development Server
```bash
cd client
npm run dev
```

Server will run on `http://localhost:3001` (or next available port)

### 2. Access the Application
Open browser and navigate to `http://localhost:3001`

---

## Testing Course Management

### Test 1: Create New Course
**Steps:**
1. Navigate to "Courses" menu
2. Click blue "Create Course" button
3. Fill form:
   - Course Name: `React Advanced Concepts`
   - Description: `Learn advanced React patterns and hooks`
   - Language: `English`
   - Price: `99.99`
   - Min Score: `60`
   - Level: `Advanced`
   - Topics: Select `Development`, `Computer Science`
4. Click "Create" button

**Expected Result:**
- ✅ Form validates (no empty required fields)
- ✅ Success toast appears
- ✅ Modal closes
- ✅ New course appears in table

---

### Test 2: View Course Details
**Steps:**
1. In Courses page, find any course
2. Click eye icon (View)

**Expected Result:**
- ✅ Modal opens with course details
- ✅ Shows course information
- ✅ Displays instructors if assigned
- ✅ Shows topics as tags
- ✅ Edit and Delete buttons visible

---

### Test 3: Edit Course
**Steps:**
1. Click eye icon to view course
2. Click "Edit" button in detail modal
3. Change course name to `{original name} - Updated`
4. Change price to `149.99`
5. Click "Update" button

**Expected Result:**
- ✅ Form modal opens with pre-filled data
- ✅ Changes are applied
- ✅ Success toast appears
- ✅ Detail modal shows updated info
- ✅ Course list shows updated data

---

### Test 4: Delete Course
**Steps:**
1. Click eye icon to view course
2. Click red "Delete" button
3. Confirm deletion in dialog

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Course removed from list
- ✅ Success toast appears
- ✅ Course no longer visible in table

---

### Test 5: Filter Courses
**Steps:**
1. In Courses page, use filter dropdowns
2. Filter by Topic
3. Filter by Level

**Expected Result:**
- ✅ Table updates based on filters
- ✅ Only matching courses shown
- ✅ Can clear filters

---

## Testing Student & Instructor Management

### Test 6: View Students
**Steps:**
1. Click "Users" in sidebar
2. Default tab shows students
3. See statistics at top

**Expected Result:**
- ✅ Shows total students count
- ✅ Shows active students count
- ✅ Student table populated
- ✅ Each student shows:
   - ID
   - Name
   - Username
   - Email (clickable)
   - Enrollment date
   - Status tag

---

### Test 7: Search Students
**Steps:**
1. In Users page, Students tab
2. Type in search box: `John`
3. Search by email: `jane`
4. Search by username: `bob`

**Expected Result:**
- ✅ Table filters in real-time
- ✅ Only matching students shown
- ✅ Clear search restores full list

---

### Test 8: View Instructors
**Steps:**
1. Click "Users" in sidebar
2. Click "Instructors" tab
3. See statistics at top

**Expected Result:**
- ✅ Shows total instructors count
- ✅ Shows active instructors count
- ✅ Instructor table populated
- ✅ Each instructor shows:
   - ID
   - Name
   - Username
   - Email (clickable)
   - Qualification
   - Hourly rate

---

### Test 9: Search Instructors
**Steps:**
1. In Users page, Instructors tab
2. Type in search box: `Smith`
3. Search by email: `michael`
4. Search by qualification

**Expected Result:**
- ✅ Table filters in real-time
- ✅ Only matching instructors shown
- ✅ Clear search restores full list

---

## Testing Form Validation

### Test 10: Form Validation
**Steps:**
1. Click "Create Course"
2. Try to submit empty form
3. Leave Course Name empty
4. Enter negative price

**Expected Result:**
- ✅ Required fields show error messages
- ✅ Price validation works
- ✅ Form won't submit with errors
- ✅ Error messages are clear

---

## Testing UI Responsiveness

### Test 11: Mobile Responsiveness
**Steps:**
1. Open browser DevTools (F12)
2. Toggle Device Toolbar (mobile view)
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px)

**Expected Result:**
- ✅ Layout adapts to screen size
- ✅ Tables remain functional
- ✅ Modals display properly
- ✅ Forms are usable on mobile

---

## Testing Data Persistence

### Test 12: Mock Data Persistence
**Steps:**
1. Create a new course
2. Refresh page (F5)
3. Check if course still exists

**Expected Result:**
- ✅ Course persists after refresh
- ✅ Mock data maintained in memory
- ✅ All changes preserved

---

## Testing Navigation

### Test 13: Navigation Between Pages
**Steps:**
1. Navigate to Courses
2. Click Users
3. Switch between Students and Instructors tabs
4. Go back to Courses

**Expected Result:**
- ✅ Navigation works smoothly
- ✅ No console errors
- ✅ Page content loads correctly

---

## Troubleshooting

### Issue: Port already in use
```bash
# Kill process on port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3001
kill -9 <PID>
```

### Issue: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors
```bash
# Clear cache
rm -rf .vite
npm run dev
```

---

## Expected Test Results Summary

| Test | Expected | Status |
|------|----------|--------|
| Create Course | Course added to list | ✅ |
| View Details | Modal shows info | ✅ |
| Edit Course | Course updated | ✅ |
| Delete Course | Course removed | ✅ |
| Filter Courses | Table filtered | ✅ |
| View Students | List populated | ✅ |
| Search Students | Filtered results | ✅ |
| View Instructors | List populated | ✅ |
| Search Instructors | Filtered results | ✅ |
| Form Validation | Errors shown | ✅ |
| Responsiveness | Works on all sizes | ✅ |
| Data Persistence | Data maintained | ✅ |
| Navigation | No errors | ✅ |

---

## Performance Testing

### Check Network Activity
1. Open DevTools → Network tab
2. Perform actions (create, view, etc.)
3. Check request times (should be ~500ms for demo)

### Check Console
1. Open DevTools → Console
2. Perform all actions
3. Verify no errors appear

### Check Memory
1. Open DevTools → Memory
2. Take heap snapshot before/after operations
3. Verify no memory leaks

---

## Checklist Before Production

- [ ] All tests pass
- [ ] No console errors
- [ ] No TypeScript warnings
- [ ] Form validation works
- [ ] CRUD operations work
- [ ] Search functionality works
- [ ] Responsive on all devices
- [ ] Toast notifications appear
- [ ] Confirmation dialogs work
- [ ] Navigation is smooth
- [ ] Performance is acceptable

---

**Testing Date:** December 4, 2024  
**Status:** Ready for QA
