# 🚀 SETUP & RUN PRISMA DATABASE

## 📍 Database Connection

```
Host: 192.168.1.200
Port: 3307
User: root
Password: admin@123
Database: BTL2
```

---

## ⚡ RUN SETUP NOW! (Choose One)

### 🏃 **FASTEST - All in One Command (5-10 min)**

Copy-paste this command:

```bash
cd server && npm install && npm run prisma:generate && npx prisma migrate deploy && npm run prisma:seed
```

Then when done:
```bash
npm run prisma:studio
```

---

### 🚶 **STEP BY STEP (If you hit errors)**

```bash
# Step 1
cd server

# Step 2: Install npm packages
npm install

# Step 3: Generate Prisma Client
npm run prisma:generate

# Step 4: Create database & migrations
npm run prisma:migrate
# If prompted, enter: init

# Step 5: Load test data
npm run prisma:seed

# Step 6: Verify
npm run prisma:studio
```

---

### 🔧 **FOR BASH USERS (macOS/Linux)**

```bash
cd server && bash setup-db.sh
```

---

## ✅ HOW TO VERIFY SUCCESS

### Method 1: Visual (Recommended)

```bash
npm run prisma:studio
```

Open browser: http://localhost:5555

You should see:
- ✅ 15 Users
- ✅ 8 Courses
- ✅ 10 Sections
- ✅ 12 Lectures
- ✅ 6 Tests
- ✅ All other tables

### Method 2: MySQL Client

```bash
mysql -h 192.168.1.200 -P 3307 -u root -padmin@123 BTL2

# Inside MySQL:
SHOW TABLES;
SELECT COUNT(*) FROM User;
SELECT COUNT(*) FROM Course;
SELECT COUNT(*) FROM Enrollment;
```

---

## 📊 What Gets Created

### Users (15 total)
- 1 Admin: `admin_hcmut` / Password: `password123`
- 4 Instructors: `gv_thanh`, `gv_huong`, `gv_minh`, `gv_lan`
- 10 Students: `sv_001` to `sv_010`

### Courses (8)
- C++ từ cơ bản đến nâng cao
- Cấu trúc dữ liệu & Giải thuật
- Lập trình Web với React
- Cơ sở dữ liệu nâng cao
- Python cho AI/ML
- Nhập môn Trí Tuệ Nhân Tạo
- Mạng máy tính nâng cao
- AWS Cloud Solutions

### Content
- 10 Sections, 12 Lectures
- 6 Tests with 8 Questions each
- 15 Answer Choices per question
- 7 Enrollments, 7 Transactions
- 6 Lecture Views, 3 Test Results
- 3 Course Ratings, 2 Certificates

**Total: 20 tables, 200+ records, all relationships working**

---

## ❌ TROUBLESHOOTING

### Error: "Connection refused"
```
Error: connect ECONNREFUSED 192.168.1.200:3307
```

**Fix:**
- Is MySQL running on Synology? (Check with: `ping 192.168.1.200`)
- Is port 3307 open?
- Check .env file has correct DATABASE_URL

### Error: "Access denied for user 'root'"
```
Error: Access denied for user 'root'@'192.168.1.200'
```

**Fix:**
- Check password: `admin@123` ✅
- Check username: `root` ✅
- Verify in MySQL Synology settings

### Error: "Database does not exist"
```
Error: Unknown database 'BTL2'
```

**Fix:**
- Database will be auto-created by Prisma
- If error persists: `npm run prisma:reset`

### "Port already in use"
```
Error: listen EADDRINUSE :::3000
```

**Fix:**
```bash
lsof -ti:3000 | xargs kill -9
npm run start:dev
```

---

## 📚 REFERENCE GUIDES

After setup is done:

- **Setup Details**: `SETUP_PRISMA.md`
- **All Commands**: `COMMANDS_REFERENCE.md`
- **Full Guide**: `../Doc/DATABASE_INITIALIZATION_GUIDE.md`
- **Integration**: `../Doc/NESTJS_PRISMA_INTEGRATION.md`
- **Queries**: `src/prisma/prisma.queries.example.ts`

---

## 🎯 NEXT STEPS AFTER SETUP

```bash
# 1. View data
npm run prisma:studio

# 2. Start development
npm run start:dev

# 3. Read integration guide
cat ../Doc/NESTJS_PRISMA_INTEGRATION.md

# 4. Create first service
# Refer to: src/prisma/prisma.queries.example.ts
```

---

## 📋 CHECKLIST

- [ ] Run setup command
- [ ] npm install completes
- [ ] prisma:migrate completes
- [ ] prisma:seed completes
- [ ] Open prisma:studio
- [ ] See 15 Users
- [ ] See 8 Courses
- [ ] See other tables
- [ ] Ready to code!

---

## 💡 HELPFUL COMMANDS

```bash
# Check npm scripts
cat package.json | grep scripts -A 20

# View environment
cat .env

# Test connection
mysql -h 192.168.1.200 -P 3307 -u root -padmin@123 -e "SELECT 1"

# See all tables
mysql -h 192.168.1.200 -P 3307 -u root -padmin@123 -e "USE BTL2; SHOW TABLES;"

# Reset everything (⚠️ deletes data)
npm run prisma:reset
```

---

**✅ You're ready! Run the setup command now! 🚀**
