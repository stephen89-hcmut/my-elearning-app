# ⚡ QUICK FIX & RUN BACKEND

## 🚨 VẤNĐỀ CỦA BẠN

```
npm run prisma:studio → không hoạt động
npm run dev → không hoạt động
```

## ✅ NGUYÊN NHÂN

**Chưa chạy `npm install`** → `node_modules` không tồn tại

---

## 🔧 GIẢI PHÁP

### **Lần 1: Cài Dependencies (3-5 phút, chỉ cần làm 1 lần)**

**Tại root folder (`my-elearning-app`), chạy:**

```bash
python3 SETUP_AND_TEST.py
```

**HOẶC tại server folder, chạy từng lệnh:**

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

**Chờ xong hết, không nên Ctrl+C!**

---

## ✅ SAU ĐÓ, CHẠY BACKEND

```bash
cd server
npm run start:dev
```

**Server sẽ khởi động tại: http://localhost:3000**

---

## 🧪 TEST BACKEND

### Cách 1: Xem dữ liệu visual

```bash
# Terminal khác
npm run prisma:studio
# Mở: http://localhost:5555
```

Thấy 15 users, 8 courses → ✅ Database đã setup

---

### Cách 2: Test API

Dùng Postman/curl:

```bash
curl http://localhost:3000/users
```

---

## 📝 CHI TIẾT

Xem: `server/FIX_NPM_NOT_WORKING.md` và `server/RUN_AND_TEST_BACKEND.md`

---

**🎯 Chạy ngay và báo kết quả!**
