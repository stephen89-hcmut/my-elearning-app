# 🚀 Quick Start - Database Setup

Hướng dẫn nhanh để thiết lập database cho e-learning app với Prisma.

## 1️⃣ Cài đặt Dependencies

```bash
cd server
npm install
```

## 2️⃣ Cấu hình Database

Kiểm tra `.env` đã được cấu hình với MySQL trên Docker Synology:

```env
DATABASE_URL="mysql://root:admin@123@192.168.1.200:3307/BTL2"
```

Nếu cần sửa đổi, chỉnh sửa file `.env` trong thư mục `server`.

## 3️⃣ Tạo Database & Migration

```bash
npm run prisma:migrate
```

Nhập tên migration (ví dụ: `init`)

## 4️⃣ Seed Dữ Liệu Test

```bash
npm run prisma:seed
```

✅ **Xong!** Database đã sẵn sàng với dữ liệu test.

---

## 🔍 Xem Dữ Liệu (Tùy chọn)

Mở Prisma Studio để xem và quản lý dữ liệu:

```bash
npm run prisma:studio
```

## 📦 Reset Database (Nếu cần)

```bash
npm run prisma:reset
```

---

## 🧪 Các Lệnh Prisma Khác

| Lệnh                      | Mô tả                       |
| ------------------------- | --------------------------- |
| `npm run prisma:migrate`  | Tạo migration và áp dụng    |
| `npm run prisma:generate` | Generate Prisma Client      |
| `npm run prisma:seed`     | Seed dữ liệu test           |
| `npm run prisma:studio`   | Mở Prisma Studio            |
| `npm run prisma:reset`    | Reset database (xóa tất cả) |

---

## 👥 Dữ Liệu Test

Database được seed với:

- **1 Admin**: `admin_hcmut` / `password123`
- **4 Instructors**: `gv_thanh`, `gv_huong`, `gv_tung`, `gv_minh`
- **10 Students**: `sv_an`, `sv_binh`, `sv_cuong`, v.v.
- **8 Courses** với 6 topics, lectures, tests, và questions
- **Enrollments, Transactions, Ratings, Certificates, & Activity Data**

Tất cả user demo có password: `password123`

---

## ⚠️ Lưu Ý

- Database mặc định: `BTL2` (MySQL)
- User mặc định: `root` (không password)
- Thay đổi `.env` nếu cấu hình khác
- **KHÔNG sử dụng password demo trong production**

---

## 🐛 Troubleshooting

**Lỗi: Connection refused**
→ Kiểm tra MySQL server có chạy

**Lỗi: Database không tồn tại**
→ Tạo database: `CREATE DATABASE BTL2;`

**Lỗi: Migration conflict**
→ Chạy: `npm run prisma:reset`

---

**Tài liệu đầy đủ**: Xem `PRISMA_SETUP.md`
