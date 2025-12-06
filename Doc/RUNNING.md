# 🏃 Running the Application

Guide to start and run the EduCore E-Learning Dashboard application.

## 🚀 Quick Start (3 minutes)

### Start Everything

```bash
npm run dev
```

This starts both the frontend and backend servers simultaneously using `concurrently`.

**You should see**:
```
[dev:client] ✔ Console Ninja extension is connected to Vite
[dev:client]   VITE v5.4.21  ready in 824 ms
[dev:client]   ➜  Local:   http://localhost:3000/
[dev:server] [Nest] 12/06/12:24:53     LOG [NestFactory] Nest application successfully started +2ms
```

### Access the Application

- **Frontend**: http://localhost:3000 (React app with UI)
- **Backend**: http://localhost:3001 (NestJS API)

---

## 🎯 Development Workflows

### Option 1: Full Stack Development (Frontend + Backend)

**Single Command**:
```bash
npm run dev
```

**Separate Terminals** (if you need independent control):

Terminal 1 - Frontend:
```bash
npm run dev:client
```

Terminal 2 - Backend:
```bash
npm run dev:server
```

### Option 2: Frontend Only

```bash
npm run dev:client
```

Or:
```bash
cd client && npm run dev
```

The frontend works with mock data, so backend is optional for UI development.

### Option 3: Backend Only

```bash
npm run dev:server
```

Or:
```bash
cd server && npm run start:dev
```

---

## 📊 Development Server Details

### Frontend (Vite)

- **Port**: 3000
- **Hot Module Reload (HMR)**: Enabled
- **Build Tool**: Vite (fast refresh)
- **URL**: http://localhost:3000

**Features**:
- Fast refresh on file changes
- TypeScript compilation
- ESLint checking

### Backend (NestJS)

- **Port**: 3001
- **Watch Mode**: Enabled
- **Auto-reload**: On file changes
- **URL**: http://localhost:3001

**Features**:
- Auto-compilation on changes
- Debug output in console
- Error handling

---

## 🧪 Demo Account

Use these credentials to log in:

```
Username: sManager
Password: password123
```

Other available accounts:
- `instructor` / `password123`
- `student` / `password123`

---

## 📱 Testing the Application

### Quick Test Flow

1. **Open Frontend**: http://localhost:3000
2. **Login**: Use `sManager` / `password123`
3. **Explore Pages**:
   - Dashboard - View statistics
   - Courses - Create, edit, delete courses
   - Students - View student list
   - Instructors - View instructor list

### Test Create Course

1. Click "Create New Course"
2. Fill in details:
   - Course Name: "Test Course"
   - Description: "Test description"
   - Language: Select from dropdown
   - Price: Enter number
   - Level: Select level
3. Click "Submit"
4. See success notification
5. New course appears in table

### Test Edit Course

1. Click "Edit" on any course
2. Modify details
3. Click "Update"
4. See success notification

### Test Delete Course

1. Click "View" on any course
2. Click "Delete"
3. Confirm in popup
4. Course removed from list

---

## 🔍 Debugging

### View Console Logs

**Frontend Console**:
- Open browser DevTools: `F12`
- Go to Console tab
- See all frontend logs and errors

**Backend Console**:
- Watch the terminal where `npm run dev:server` is running
- See all API requests and logs

### Enable Debug Mode

```bash
# Frontend with debug logs
DEBUG=* npm run dev:client

# Backend with debug logs
DEBUG=* npm run dev:server
```

### TypeScript Errors

If you see TypeScript errors in console:
1. Check terminal output
2. Fix the error in your code
3. Save file
4. Dev server auto-reloads

---

## 🛑 Stopping the Application

### Stop All Servers

```bash
# Press Ctrl+C in the terminal running npm run dev
```

### Stop Specific Server

If running in separate terminals:
```bash
# Press Ctrl+C in the terminal you want to stop
```

---

## 📦 Production Build

### Build for Production

```bash
npm run build
```

This creates optimized bundles:
- `client/dist/` - Frontend bundle
- `server/dist/` - Backend bundle

### Run Production Build

```bash
# Start production server
npm run start:server

# Or for backend only
cd server && npm run start:prod
```

---

## 🐛 Common Issues & Solutions

### Issue: "Port 3000 already in use"

**Error Message**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Find process using port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Change port in vite.config.ts (Optional)
# In client/vite.config.ts:
server: {
  port: 5173  // Change this
}
```

### Issue: "Port 3001 already in use"

**Solution**:
```bash
# Find and kill process (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Find and kill process (macOS/Linux)
lsof -ti:3001 | xargs kill -9

# Or change port in main.ts (Optional)
const PORT = process.env.PORT || 3002;  // Change 3002
```

### Issue: "Cannot find module..."

**Solution**:
```bash
# Reinstall dependencies
npm run install:all

# Or for specific folder
cd server && npm install --legacy-peer-deps
```

### Issue: "Database connection refused"

**Solution**:
1. Ensure MySQL is running
2. Check credentials in `.env`
3. Verify database exists: `SHOW DATABASES;` in MySQL
4. Restart MySQL service

### Issue: "API not responding (404)"

**Possible Causes**:
- Backend not running
- Wrong API URL in frontend
- API endpoint doesn't exist

**Solution**:
1. Verify backend running: http://localhost:3001
2. Check `VITE_API_URL` in `client/.env`
3. Check API endpoints in `doc/API.md`

### Issue: "HMR (Hot Module Reload) not working"

**Solution**:
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (macOS)

# Or restart dev server
# Press Ctrl+C and run again
npm run dev
```

---

## ⚙️ Customizing Ports

### Change Frontend Port

Edit `client/vite.config.ts`:
```typescript
server: {
  port: 5173,  // Change this
}
```

### Change Backend Port

Edit `server/.env`:
```env
PORT=3002  # Change this
```

Or edit `server/main.ts`:
```typescript
const PORT = process.env.PORT || 3002;
```

### Update API URL in Frontend

If you change backend port, update `client/.env`:
```env
VITE_API_URL=http://localhost:3002/api
```

---

## 🎓 Tips & Best Practices

1. **Use separate terminals** for frontend and backend during development
2. **Keep browser DevTools open** to catch console errors early
3. **Check network tab** to see all API requests and responses
4. **Enable ESLint** to catch code issues automatically
5. **Use TypeScript** strict mode for better type safety
6. **Restart server** if you modify `.env` or configuration files

---

## 📚 Next Steps

- **API Development**: See `doc/API.md`
- **Understanding Architecture**: See `doc/ARCHITECTURE.md`
- **Testing**: See `doc/TESTING.md`
- **Configuration**: See `doc/CONFIGURATION.md`

---

**Last Updated**: December 2025
**Version**: 1.0
