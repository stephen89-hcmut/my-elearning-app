# 🔧 FIX: npm run prisma:studio không hoạt động

## 🚨 VẤN ĐỀ

```
npm run prisma:studio - không hoạt động
npm run dev - không hoạt động
```

## ✅ NGUYÊN NHÂN

**Thư mục `node_modules` không tồn tại!**

Bạn chưa chạy `npm install` để tải dependencies.

---

## 🔧 GIẢI PHÁP - CHẠY 1 LẦN

### **Option 1: Chạy Python Script (Dễ Nhất)**

Mở Terminal tại root folder:

```bash
python3 SETUP_AND_TEST.py
```

**Hoặc:**

```bash
python SETUP_AND_TEST.py
```

Script này sẽ tự động:

1. ✅ Cài npm packages (npm install)
2. ✅ Generate Prisma Client
3. ✅ Tạo database migrations
4. ✅ Seed dữ liệu test
5. ✅ In hướng dẫn tiếp theo

---

### **Option 2: Chạy Từng Lệnh (Từng Bước)**

Mở Terminal, chạy các lệnh này **lần lượt**:

```bash
# 1. Vào folder server
cd server

# 2. Cài npm packages (3-5 phút, chờ nó xong)
npm install

# 3. Generate Prisma Client (< 1 phút)
npm run prisma:generate

# 4. Tạo database (1-2 phút)
npm run prisma:migrate

# 5. Seed dữ liệu (< 1 phút)
npm run prisma:seed

# 6. Xem dữ liệu
npm run prisma:studio
```

**Sau bước 2 (npm install) xong, mới chạy bước tiếp theo!**

---

### **Option 3: All in One Command**

```bash
cd server && npm install && npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed
```

---

## ✅ KIỂM TRA NHƯ THẾ NÀO

### Sau khi cài xong, chạy:

```bash
cd server
npm run prisma:studio
```

Sẽ mở browser tại **http://localhost:5555**

Bạn sẽ thấy:

- ✅ 15 Users
- ✅ 8 Courses
- ✅ Tất cả tables

---

## 🚀 CHẠY BACKEND TEST

Khi setup xong, chạy:

```bash
cd server
npm run start:dev
```

Server sẽ khởi động tại **http://localhost:3000**

---

## 📋 KIỂM TRA LỖI

Nếu gặp lỗi:

### Lỗi 1: "npm: command not found"

```
npm chưa được cài đặt
→ Cài Node.js từ: https://nodejs.org/
```

### Lỗi 2: "EACCES: permission denied"

```
→ Thêm sudo: sudo npm install
```

### Lỗi 3: "Connection refused to 192.168.1.200:3307"

```
→ MySQL Synology không chạy
→ Kiểm tra: ping 192.168.1.200
```

### Lỗi 4: "node_modules still not created"

```
→ Xóa và cài lại:
   rm -rf node_modules package-lock.json
   npm install
```

---

## 💡 TIPS

1. **Chạy lần đầu tiên** sẽ lâu (npm install: 3-5 phút)
2. **Lần thứ 2 trở đi** nhanh hơn (< 30 giây)
3. **Không nên Ctrl+C** khi npm install đang chạy
4. **Chắc chắn kết nối Internet** tốt

---

## ✨ SAU KHI XONG

```bash
# Xem dữ liệu (visual)
npm run prisma:studio

# Chạy backend
npm run start:dev

# Run tests
npm test
```

---

**🎯 Chạy Option 1 hoặc Option 2 ở trên, rồi báo tôi kết quả!**
