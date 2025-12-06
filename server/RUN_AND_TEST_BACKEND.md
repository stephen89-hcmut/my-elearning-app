# 🚀 CHẠY & TEST BACKEND

## 📋 ĐỀU KIỆN TRƯỚC TIÊN

Trước khi chạy backend, phải hoàn thành setup:

```bash
# 1. npm install (nếu chưa)
npm install

# 2. Prisma setup (nếu chưa)
npm run prisma:migrate
npm run prisma:seed
```

**Nếu chưa làm, chạy script fix trước:**

```bash
cd ..
python3 SETUP_AND_TEST.py
cd server
```

---

## ✅ CHẠY BACKEND

### **Cách 1: Development Mode (Recommended)**

```bash
npm run start:dev
```

**Kết quả:**

```
[Nest] 123  - 12/06/2025, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 123  - 12/06/2025, 10:30:02 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 123  - 12/06/2025, 10:30:02 AM     LOG [NestApplication] Nest application successfully started
[Nest] 123  - 12/06/2025, 10:30:02 AM     LOG Listen on port 3000
```

Server chạy tại: **http://localhost:3000**

✅ Auto-reload khi sửa code

---

### **Cách 2: Production Mode**

```bash
npm run build
npm run start:prod
```

---

## 🧪 TEST BACKEND

### **Option 1: Xem Dữ Liệu Visual**

```bash
# Mở terminal khác, chạy:
npm run prisma:studio
```

Mở: http://localhost:5555

Bạn sẽ thấy:

- Users table (15 records)
- Courses table (8 records)
- Tất cả dữ liệu khác

---

### **Option 2: Test API Endpoints**

#### Dùng curl:

```bash
# Get all users
curl http://localhost:3000/users

# Get all courses
curl http://localhost:3000/courses

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hcmut.edu.vn","password":"password123"}'
```

#### Dùng Postman/Thunder Client:

1. Mở Postman hoặc Thunder Client
2. Tạo request:
   - **Method**: GET
   - **URL**: http://localhost:3000/users
3. Click Send
4. Xem response

---

### **Option 3: Test Database Connection**

```bash
# Trong server folder:
cd server

# Kiểm tra kết nối
npm run prisma:studio
```

Nếu Prisma Studio mở được → Database connected ✅

---

## 🔍 KIỂM TRA CÁC ENDPOINT CÓ SẴN

### Xem trong src/modules:

```bash
ls -la src/modules/
```

Bạn sẽ thấy:

- `auth/` - Authentication
- `courses/` - Course management
- `users/` - User management
- `reports/` - Reports

Mỗi module có:

- `*.controller.ts` - Endpoints
- `*.service.ts` - Business logic
- `dto/` - Data validation

---

## 📊 KIỂM TRA CONTROLLER HOẠT ĐỘNG

Mở file: `src/modules/courses/courses.controller.ts`

Bạn sẽ thấy các endpoint:

```typescript
@Get()
findAll() { }

@Get(':id')
findOne(@Param('id') id: string) { }

@Post()
create(@Body() createCourseDto: CreateCourseDto) { }

@Patch(':id')
update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) { }

@Delete(':id')
remove(@Param('id') id: string) { }
```

---

## 🧐 TROUBLESHOOTING BACKEND

### Lỗi 1: "Port 3000 already in use"

```
Error: listen EADDRINUSE :::3000
```

**Fix:**

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Then run again
npm run start:dev
```

---

### Lỗi 2: "Cannot find module '@prisma/client'"

```
Error: Cannot find module '@prisma/client'
```

**Fix:**

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Or reinstall
rm -rf node_modules
npm install
```

---

### Lỗi 3: "Database connection failed"

```
Error: P1000: Can't reach database server
```

**Fix:**

```bash
# Check MySQL is running
ping 192.168.1.200

# Check .env DATABASE_URL
cat .env | grep DATABASE_URL

# Should be:
# DATABASE_URL="mysql://root:admin@123@192.168.1.200:3307/BTL2"
```

---

### Lỗi 4: "TypeScript compilation errors"

```
Error: src/main.ts:1:1 - error TS2307: Cannot find module
```

**Fix:**

```bash
# Rebuild
npm run build

# Or restart dev server
npm run start:dev
```

---

## 📝 LOGS & DEBUGGING

### Xem logs:

```bash
# Khi chạy npm run start:dev
# Logs sẽ hiển thị trong terminal
```

### Debug mode:

```bash
npm run start:debug
```

Sẽ mở Node debugger tại port 9229

---

## 🎯 WORKFLOW PHÁT TRIỂN

1. **Terminal 1**: Chạy backend

   ```bash
   npm run start:dev
   ```

2. **Terminal 2**: Chạy Prisma Studio (xem dữ liệu)

   ```bash
   npm run prisma:studio
   ```

3. **Browser**: Test API
   - Postman: http://localhost:3000/api-docs
   - Prisma Studio: http://localhost:5555

4. **VS Code**: Code & save → Auto-reload

---

## 🔗 API TESTING TOOLS

### Recommended:

1. **Postman** - Desktop app
   - Download: https://www.postman.com/downloads/
   - Import: No need, just use URLs

2. **Thunder Client** - VS Code extension
   - Install: Ctrl+Shift+X → Search "Thunder Client"
   - Built-in to VS Code

3. **REST Client** - VS Code extension
   - Install: Ctrl+Shift+X → Search "REST Client"
   - Create `.http` files in project

4. **curl** - Command line
   ```bash
   curl http://localhost:3000/users
   ```

---

## 📚 THAM KHẢO

- Controllers: `src/modules/*/`
- DTOs: `src/modules/*/dto/`
- Services: `src/modules/*/`
- Query examples: `src/prisma/prisma.queries.example.ts`

---

## ✅ CHECKLIST

- [ ] npm install completed
- [ ] prisma:migrate completed
- [ ] prisma:seed completed
- [ ] npm run start:dev starts successfully
- [ ] Server listens on port 3000
- [ ] npm run prisma:studio opens
- [ ] Can see 15 users, 8 courses
- [ ] API endpoints responding

---

## 🚀 READY TO TEST!

```bash
cd server
npm run start:dev
```

Server running? → Go to http://localhost:3000 ✅

---

**Happy Testing! 🎉**
