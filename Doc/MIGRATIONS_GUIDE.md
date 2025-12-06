# 📋 Prisma Migrations Guide

Hướng dẫn làm việc với Prisma migrations - tự động schema version control.

## 🤔 Migrations là gì?

Migrations là những file SQL được tạo tự động từ schema changes. Chúng giúp:
- ✅ Version control của database schema
- ✅ Rollback dễ dàng
- ✅ Collaborated development
- ✅ Production deployment an toàn

---

## 📂 Migration Files Location

```
server/prisma/migrations/
├── migration_lock.toml
├── 20240101120000_init/
│   └── migration.sql
├── 20240102150000_add_new_field/
│   └── migration.sql
└── ...
```

---

## 🚀 Các Lệnh Cơ Bản

### 1. Tạo Migration Mới (Sau khi edit schema.prisma)

```bash
npm run prisma:migrate -- --name your_migration_name
```

**Ví dụ:**
```bash
npm run prisma:migrate -- --name add_course_description
npm run prisma:migrate -- --name create_user_roles
npm run prisma:migrate -- --name rename_field
```

### 2. Kiểm tra Migration Status

```bash
npx prisma migrate status
```

Output:
```
Status

3 migrations found in prisma/migrations

Your local migration history and the migrations table from your database are different:

The last common migration is: 20240101_init

The migrations have not yet been applied:
  20240102_add_field
  20240103_update_schema
```

### 3. Apply Pending Migrations

```bash
npm run prisma:migrate -- deploy
```

Hoặc tự động khi dev:
```bash
npm run prisma:migrate
```

### 4. Reset Database (Xóa tất cả!)

```bash
npm run prisma:reset
```

Quy trình:
1. Xóa database
2. Tạo database mới
3. Chạy tất cả migrations
4. Seed data

### 5. Generate Prisma Client (Khi schema thay đổi)

```bash
npm run prisma:generate
```

---

## 📝 Ví Dụ Workflow

### Scenario: Thêm field `description` vào User model

#### Step 1: Edit schema.prisma
```prisma
model User {
  userId          Int       @id @default(autoincrement()) @map("user_id")
  username        String    @unique @db.VarChar(50)
  email           String    @unique @db.VarChar(255)
  firstName       String    @db.VarChar(50) @map("first_name")
  lastName        String    @db.VarChar(50) @map("last_name")
  password        String    @db.VarChar(100)
  role            UserRole  @default(STUDENT)
  bankName        String?   @db.VarChar(100) @map("bank_name")
  paymentAccount  String?   @db.VarChar(100) @map("payment_account")
  description     String?   @db.Text  // 👈 THÊM FIELD NÀY

  admin           Admin?
  instructor      Instructor?
  student         Student?

  @@map("USERS")
}
```

#### Step 2: Tạo migration
```bash
npm run prisma:migrate -- --name add_user_description
```

**Output:**
```
✔ Name of migration … add_user_description
✔ Created migration: prisma/migrations/20240120150000_add_user_description/migration.sql

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": MySQL database "BTL2" at "localhost:3306"

✔ Database synced, created 1 migration file, and regenerated Prisma Client in 234ms

Next steps:
1. Check the migration.sql file to ensure the changes are correct
2. Run `npm run start:dev` to start using the new schema
```

#### Step 3: Kiểm tra migration.sql
```sql
-- prisma/migrations/20240120150000_add_user_description/migration.sql

-- AlterTable
ALTER TABLE `USERS` ADD COLUMN `description` TEXT NULL;
```

#### Step 4: Apply migration (tự động)
Migration đã được apply! Bây giờ có thể sử dụng field mới.

---

## 🔄 Ví Dụ Khác: Tạo Bảng Mới

### Thêm model Rating mới

#### Step 1: Edit schema.prisma
```prisma
// Thêm model mới
model Rating {
  ratingId    Int     @id @default(autoincrement()) @map("rating_id")
  userId      Int     @map("user_id")
  rating      Int
  comment     String? @db.Text
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [userId], onDelete: Cascade)

  @@map("RATINGS")
}

// Update User model để có relation
model User {
  // ... existing fields ...
  ratings Rating[]
}
```

#### Step 2: Tạo migration
```bash
npm run prisma:migrate -- --name create_rating_table
```

**Generated migration.sql:**
```sql
-- CreateTable
CREATE TABLE `RATINGS` (
    `rating_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`rating_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RATINGS` ADD CONSTRAINT `RATINGS_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `USERS`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## 🚨 Edge Cases & Solutions

### Case 1: Xóa Field
```prisma
// Trước
model Course {
  courseId     Int    @id
  courseName   String
  oldField     String // ❌ REMOVE THIS
}

// Sau
model Course {
  courseId     Int    @id
  courseName   String
  // oldField removed
}
```

```bash
npm run prisma:migrate -- --name remove_old_field_from_course
```

**Generated:**
```sql
-- AlterTable
ALTER TABLE `COURSES` DROP COLUMN `oldField`;
```

### Case 2: Đổi Tên Field
```prisma
// Trước
model Course {
  courseName String  // ❌ Old name
}

// Sau
model Course {
  name String  @map("course_name")  // ✅ New name
}
```

```bash
npm run prisma:migrate -- --name rename_course_name_to_name
```

### Case 3: Thay Đổi Type

```prisma
// Trước
model Lecture {
  duration Int
}

// Sau
model Lecture {
  duration Decimal @db.Decimal(5,2)  // Changed to decimal
}
```

```bash
npm run prisma:migrate -- --name change_lecture_duration_type
```

---

## ⚠️ Migration Best Practices

### ✅ DO:

1. **Review migration.sql trước apply**
   ```bash
   # Kiểm tra file trước apply
   cat prisma/migrations/20240120150000_your_migration/migration.sql
   ```

2. **Đặt tên migration chi tiết**
   ```bash
   npm run prisma:migrate -- --name add_course_description  ✅ Good
   npm run prisma:migrate -- --name update               ❌ Bad
   ```

3. **Test migrations locally trước deploy**
   ```bash
   npm run prisma:migrate -- deploy  # Test deployment
   ```

4. **Commit migrations vào git**
   ```bash
   git add prisma/migrations/
   git commit -m "Add course description field"
   ```

5. **Backup database trước deploy ke production**

### ❌ DON'T:

1. **Xóa hoặc sửa migration files** (sau khi apply)
   ```bash
   # ❌ DON'T:
   rm -rf prisma/migrations/20240120150000_old_migration
   ```

2. **Manually edit migration.sql** (trừ khi expert)
   ```bash
   # ❌ DON'T:
   vim prisma/migrations/20240120150000_init/migration.sql
   ```

3. **Tạo hai migration cùng lúc**
   ```bash
   npm run prisma:migrate -- --name first &  ❌ Bad
   npm run prisma:migrate -- --name second & ❌ Bad
   ```

4. **Push production data trước test migrations**

---

## 🔧 Advanced: Custom Migration

Nếu cần tạo custom migration:

```bash
npx prisma migrate create --name my_custom_migration
```

**Edit file migration.sql tạo ra:**
```sql
-- Thêm custom SQL ở đây
UPDATE `COURSES` SET `price` = `price` * 1.1 WHERE `level` = 2;
```

---

## 📊 Checking Migration History

```bash
# View all migrations
ls -la prisma/migrations/

# View specific migration
cat prisma/migrations/20240120150000_add_field/migration.sql

# Check database state
npm run prisma:studio
```

---

## 🆘 Troubleshooting Migrations

### Problem: "P1000 Authentication failed against database"

**Solution:**
```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Make sure MySQL is running
sudo systemctl status mysql
```

### Problem: "The migration cannot be applied cleanly"

**Solution:**
```bash
# Reset database (WARNING: loses data)
npm run prisma:reset

# Or manually fix:
npm run prisma:migrate -- resolve
```

### Problem: "Prisma Migrate could not create the shadow database"

**Solution:**
```bash
# Give user permission
CREATE USER 'prisma'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'prisma'@'localhost';
FLUSH PRIVILEGES;

# Update .env
DATABASE_URL="mysql://prisma:password@localhost:3306/BTL2"
```

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] All migrations tested locally
- [ ] Database backed up
- [ ] Schema validated: `npx prisma validate`
- [ ] All team members' migrations merged
- [ ] Deployment script ready

### Deployment Steps

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Check migration status
npx prisma migrate status

# 4. Deploy migrations (non-interactive)
npx prisma migrate deploy

# 5. Verify schema
npm run prisma:studio

# 6. Monitor
npm run start:prod
```

---

## 📚 Useful Resources

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Common Migration Issues](https://www.prisma.io/docs/concepts/components/prisma-migrate/troubleshooting)
- [Safe Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate/migrate-resolve)

---

## ✅ Summary

| Task | Command |
|------|---------|
| Create migration | `npm run prisma:migrate -- --name name` |
| Check status | `npx prisma migrate status` |
| Deploy migrations | `npx prisma migrate deploy` |
| Reset database | `npm run prisma:reset` |
| Generate client | `npm run prisma:generate` |
| View data | `npm run prisma:studio` |
| Validate schema | `npx prisma validate` |

---

*Last Updated: 2024*
