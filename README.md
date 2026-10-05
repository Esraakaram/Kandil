# قنديل للاستثمار العقاري - Kandil Real Estate
مشروع قنديل للاستثمار العقاري مبني باستخدام:
- **Next.js 15 (App Router)**
- **React 19**
- **Tailwind CSS**
- **Prisma ORM (SQLite)**
- **JavaScript بالكامل (بدون TypeScript)**

---

## 🚀 طريقة تشغيل المشروع محلياً

### 1. تثبيت الحزم (Dependencies):
```bash
npm install
```

### 2. تجهيز قاعدة البيانات وتغذيتها بالبيانات (Prisma):
قاعدة البيانات SQLite جاهزة ومغذية بكامل البيانات القديمة (38 مشروع، 54 وحدة، سلايدرز، مقالات، تواصل، إلخ).
إذا أردت إعادة تهيئتها أو تحديثها في أي وقت:
```bash
npx prisma db push
node prisma/seed.js
```

### 3. تشغيل السيرفر في وضع التطوير (Dev Server):
```bash
npm run dev
```

افتح المتصفح على:
👉 **[http://localhost:3000](http://localhost:3000)** (أو المنفذ الموضح في الـ Terminal).

---

## 🔐 كيفية الدخول إلى لوحة التحكم (Dashboard)

1. توجه إلى الرابط:
👉 **[http://localhost:3000/dashboard/Login](http://localhost:3000/dashboard/Login)**
أو ادخل مباشرة على:
👉 **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)**

2. بيانات الدخول الافتراضية:
- **اسم المستخدم (Username):** `admin`
- **كلمة المرور (Password):** `admin` (أو `123456`)

يمكنك من خلال لوحة التحكم إضافة وحذف وتعديل المشاريع والوحدات السكنية والرسائل والشركاء والمقالات بكل سهولة وتنعكس مباشرة على قاعدة بيانات Prisma SQLite!
