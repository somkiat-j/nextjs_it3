# Next.js + MongoDB Authentication Starter

Starter ตามโครงสร้างที่ระบุ: Register, Login, MongoDB-backed Session, HttpOnly Cookie, Logout, Forgot Password และ Reset Password

## Requirements
- Node.js รุ่นที่รองรับ Next.js 15
- MongoDB local หรือ MongoDB Atlas
- SMTP account สำหรับส่งอีเมล Reset Password

## Setup
```bash
npm install
cp .env.example .env.local
# แก้ MONGODB_URI, APP_URL, SESSION_SECRET และ SMTP_* ใน .env.local
npm run dev
```
เปิด http://localhost:3000

สร้าง SESSION_SECRET ได้ด้วย:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Routes
- `/register` สมัครสมาชิก
- `/login` เข้าสู่ระบบ
- `/dashboard` หน้าที่ต้อง Login
- `/forgot-password` ขอ Reset Link
- `/reset-password?token=...` ตั้งรหัสผ่านใหม่

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

## Security notes before production
1. เพิ่ม rate limiting แบบ shared store (เช่น Redis) ให้ register/login/forgot/reset endpoints
2. เพิ่ม Origin/CSRF validation ให้ mutation endpoints และใช้ HTTPS ใน Production
3. ใช้ MongoDB Replica Set และ transaction ใน workflow reset password เพื่อให้ update password, consume reset token และ revoke sessions เป็น atomic operation
4. พิจารณา Argon2id แทน bcrypt สำหรับระบบใหม่; โค้ดตัวอย่างใช้ bcryptjs และบังคับ password ไม่เกิน 72 UTF-8 bytes
5. เพิ่ม Email Verification, audit logs, account lockout/abuse controls และระบบจัดการ session ต่ออุปกรณ์ตามความต้องการ
6. ตั้งค่า SMTP จริงและทดสอบ deliverability; อย่า commit `.env.local`
7. TTL index cleanup ของ MongoDB เป็น background process ไม่ได้ลบตรงเวลา ดังนั้นโค้ดจึงตรวจ `expiresAt` ทุกครั้งที่ใช้ token/session

## Notes
- `services/auth.service.ts` รวม business logic ของ Register/Login/Forgot/Reset
- `lib/session.ts` เป็น server-only module และ Cookie จะเก็บ opaque random token ส่วน MongoDB เก็บ SHA-256 hash
- หน้า dashboard ตรวจ session บน server; API ที่เข้าถึงข้อมูลสำคัญต้องตรวจ auth/role ซ้ำในแต่ละ endpoint
