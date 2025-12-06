# 🔧 FIX NPM INSTALL ERROR

## ❌ LỖI

```
npm error notarget No matching version found for @prisma/cli@^5.7.1.
```

## ✅ NGUYÊN NHÂN

Package `@prisma/cli` không tồn tại trong npm.
Đúng package là `prisma` (không phải `@prisma/cli`).

## 🔧 GIẢI PHÁP

### **Tôi đã fix package.json** ✅

Xóa dòng `"@prisma/cli": "^5.7.1"` khỏi devDependencies

### **Bây giờ, chạy lệnh này:**

```bash
cd server

# 1. Xóa lock file
rm -f package-lock.json

# 2. Xóa npm cache
npm cache clean --force

# 3. Cài lại
npm install
```

**Hoặc chạy script (nếu trên macOS/Linux):**

```bash
cd server
bash fix-npm.sh
```

---

## ✅ SAU ĐÓ, TIẾP TỤC SETUP

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

---

## 🚀 CHẠY BACKEND

```bash
npm run start:dev
```

---

**Báo tôi kết quả!** 🎯
