# 🧪 Testing Guide

Comprehensive guide to testing the EduCore E-Learning Dashboard.

## 📋 Testing Overview

Testing strategy covers:
1. **Unit Tests** - Individual functions/components
2. **Integration Tests** - Component interaction
3. **Manual Tests** - User workflows
4. **API Tests** - Backend endpoints
5. **UI Tests** - Frontend components

---

## 🏃 Quick Test Commands

```bash
# Run all tests
npm run test

# Run tests for frontend only
npm run test:client

# Run tests for backend only
npm run test:server

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

---

## 🎨 Frontend Testing

### Unit Tests

Frontend unit tests use **Vitest** and **React Testing Library**.

**Test Location**: `client/src/**/*.test.tsx`

**Example Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await screen.getByText('Click').click();
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Running Frontend Tests

```bash
cd client
npm run test
```

### Frontend Testing Best Practices

1. **Test behavior, not implementation**
   ```typescript
   // ✓ Good
   expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
   
   // ✗ Bad
   expect(component.find('.submit-btn')).toBeDefined();
   ```

2. **Use semantic queries**
   ```typescript
   // ✓ Good
   screen.getByRole('button')
   screen.getByLabelText('Username')
   screen.getByPlaceholderText('Enter password')
   
   // ✗ Bad
   wrapper.find('.button')
   ```

3. **Test user interactions**
   ```typescript
   import { userEvent } from '@testing-library/user-event';
   
   await userEvent.click(screen.getByRole('button'));
   await userEvent.type(screen.getByLabelText('Username'), 'testuser');
   ```

---

## 🔧 Backend Testing

### Unit Tests

Backend unit tests use **Jest** and **NestJS Testing Module**.

**Test Location**: `server/src/**/*.spec.ts`

**Example Test**:
```typescript
import { Test } from '@nestjs/testing';
import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CoursesService]
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should create a course', async () => {
    const courseDto = {
      courseName: 'Test Course',
      description: 'Test Description',
      language: 'English',
      price: 99.99
    };

    const result = await service.create(courseDto);
    
    expect(result).toBeDefined();
    expect(result.courseName).toBe('Test Course');
  });
});
```

### Running Backend Tests

```bash
cd server
npm run test
```

### Backend Testing Best Practices

1. **Use Test Module**
   ```typescript
   const module = await Test.createTestingModule({
     providers: [Service, MockRepository]
   }).compile();
   ```

2. **Mock Dependencies**
   ```typescript
   const mockRepository = {
     find: jest.fn(),
     save: jest.fn(),
     delete: jest.fn()
   };
   ```

3. **Test Error Cases**
   ```typescript
   it('should throw error for invalid input', async () => {
     await expect(service.create(null)).rejects.toThrow();
   });
   ```

---

## 🌐 API Testing

### Using Postman

1. **Import API Collection**
   - Open Postman
   - Import `server/postman-collection.json`
   - All endpoints pre-configured

2. **Test Authentication**
   - Use `/auth/login` endpoint
   - Copy token from response
   - Set in Authorization header for other requests

3. **Test CRUD Operations**
   - Create: `POST /courses`
   - Read: `GET /courses/:id`
   - Update: `PUT /courses/:id`
   - Delete: `DELETE /courses/:id`

### Using cURL

**Login**:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"sManager","password":"password123"}'
```

**Create Course**:
```bash
curl -X POST http://localhost:3001/api/courses \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "courseName":"Test Course",
    "description":"Test",
    "language":"English",
    "price":99.99,
    "level":"beginner"
  }'
```

**Get All Courses**:
```bash
curl -X GET http://localhost:3001/api/courses \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set URL: `http://localhost:3001/api/courses`
4. Method: GET
5. Headers: Add `Authorization: Bearer TOKEN`
6. Send request

---

## 👤 Manual Testing

### Login Flow

1. Open http://localhost:3000
2. Enter credentials:
   - Username: `sManager`
   - Password: `password123`
3. Click "Login"
4. Should redirect to Dashboard
5. See user avatar in sidebar

**Test Cases**:
- [ ] Valid credentials → login successful
- [ ] Invalid password → error message
- [ ] Empty fields → validation error
- [ ] Session persists after refresh

### Course Management Flow

**Test: Create Course**
1. Click "Create New Course"
2. Fill form:
   - Course Name: "Web Development 101"
   - Description: "Learn web basics"
   - Language: "English"
   - Price: "49.99"
   - Level: "Beginner"
3. Click Submit
4. See success notification
5. Course appears in table

**Test: Edit Course**
1. Click "Edit" on any course
2. Modify course name
3. Click "Update"
4. See success notification
5. Table reflects changes

**Test: Delete Course**
1. Click "View Details"
2. Click "Delete"
3. Confirm deletion
4. See success notification
5. Course removed from table

### Student Management

1. Navigate to Students page
2. Verify student list displays
3. Check statistics cards
4. Verify pagination works
5. Test filters if available

### Instructor Management

1. Navigate to Instructors page
2. Verify instructor list displays
3. Check instructor ratings
4. Verify course count
5. Check pagination

---

## 📊 Testing Checklist

### Pre-Deployment Testing

- [ ] **Frontend**
  - [ ] All pages load correctly
  - [ ] Forms validate input
  - [ ] Navigation works
  - [ ] Responsive design (mobile/tablet)
  - [ ] No console errors

- [ ] **Backend**
  - [ ] All endpoints respond correctly
  - [ ] Authentication works
  - [ ] Database queries perform well
  - [ ] Error handling works
  - [ ] No server errors

- [ ] **Database**
  - [ ] Data persists after restart
  - [ ] No orphaned records
  - [ ] Referential integrity maintained
  - [ ] Indexes present for performance

- [ ] **Integration**
  - [ ] Frontend connects to backend
  - [ ] Data flows correctly
  - [ ] Notifications display
  - [ ] Errors handled gracefully
  - [ ] Performance acceptable

---

## 🔍 Specific Test Scenarios

### Authentication Tests

```
Test 1: Login with valid credentials
- Input: sManager / password123
- Expected: Login successful, token returned
- Actual: ✓ Pass

Test 2: Login with invalid password
- Input: sManager / wrongpassword
- Expected: Error message
- Actual: ✓ Pass

Test 3: Login with non-existent user
- Input: nonexistent / password
- Expected: Error message
- Actual: ✓ Pass

Test 4: Auto-logout after session expires
- Input: Wait for token expiration
- Expected: Redirect to login
- Actual: ✓ Pass
```

### Course CRUD Tests

```
Test 1: Create valid course
- Input: Valid course data
- Expected: Course created, appears in list
- Actual: ✓ Pass

Test 2: Create course with missing fields
- Input: Missing course name
- Expected: Validation error
- Actual: ✓ Pass

Test 3: Update course
- Input: Modified course data
- Expected: Changes persisted
- Actual: ✓ Pass

Test 4: Delete course
- Input: Click delete
- Expected: Confirmation modal, then delete
- Actual: ✓ Pass

Test 5: Delete with cancel
- Input: Click cancel on confirmation
- Expected: Course not deleted
- Actual: ✓ Pass
```

### Data Validation Tests

```
Test 1: Course name required
- Input: Empty name
- Expected: Error message
- Actual: ✓ Pass

Test 2: Price must be positive
- Input: Negative price
- Expected: Validation error
- Actual: ✓ Pass

Test 3: Min score 0-100
- Input: Score = 150
- Expected: Validation error
- Actual: ✓ Pass

Test 4: Email format validation
- Input: Invalid email
- Expected: Validation error
- Actual: ✓ Pass
```

---

## 📈 Test Coverage

### Target Coverage

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### Check Coverage

```bash
# Frontend coverage
cd client && npm run test -- --coverage

# Backend coverage
cd server && npm run test -- --coverage
```

---

## 🚀 Continuous Testing

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm run lint && npm run test || exit 1
```

### CI/CD Pipeline

GitHub Actions example:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm run test
```

---

## 🆘 Troubleshooting Tests

### Issue: Tests timeout

**Solution**:
```typescript
// Increase timeout
test('should load data', async () => {
  // test code
}, 10000);  // 10 second timeout
```

### Issue: Database not reset between tests

**Solution**:
```typescript
beforeEach(async () => {
  // Clear database
  await clearDatabase();
});
```

### Issue: Mock not working

**Solution**:
```typescript
// Use jest.mock() before importing
jest.mock('@/services/api');

// Or mock in test
const mockApi = jest.spyOn(api, 'getCoursers').mockResolvedValue([]);
```

---

## 📚 Testing Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🔗 Related Documentation

- **Running**: See `doc/RUNNING.md`
- **API**: See `doc/API.md`
- **Architecture**: See `doc/ARCHITECTURE.md`

---

**Last Updated**: December 2025
**Version**: 1.0
