# 🌱 Seed Data Reference

> Auto-seeded on first startup via `Seeder.cs`. All methods are **idempotent** (safe to re-run).

---

## 👤 Users & Credentials

| Role  | Username | Email              | Password         |
|-------|----------|--------------------|------------------|
| Admin | `admin`  | admin@example.com  | `Super@123456`   |
| Admin | `master` | master@test.com    | `Master@123456`  |

Both users are assigned to **Admin** and **Member** roles.

---

## 🔐 Roles & Permissions

| Role     | RoleNumber | IsDefault | Permissions            |
|----------|------------|-----------|------------------------|
| Admin    | 1          | No        | All system permissions |
| Member   | 2          | No        | —                      |

---

## 🏢 Departments

| English       | Arabic                           |
|---------------|----------------------------------|
| Backend       | تطوير الخلفية                    |
| Frontend      | تطوير الواجهة                    |
| Full Stack    | المطور الشامل                    |
| DevOps        | تطوير العمليات                   |
| QA            | ضمان الجودة                      |
| UI/UX         | تصميم واجهة وتجربة المستخدم     |

---

## 📊 Statuses

| Name        | Color     | Order |
|-------------|-----------|-------|
| Pending     | `#6c757d` | 1     |
| In Progress | `#ffc107` | 2     |
| Completed   | `#28a745` | 3     |
| Cancelled   | `#dc3545` | 4     |
| On Hold     | `#007bff` | 5     |

---

## 🎯 Skill Levels

| English      | Arabic  | Rank |
|--------------|---------|------|
| Beginner     | مبتدئ   | 1    |
| Intermediate | متوسط   | 2    |
| Advanced     | متقدم   | 3    |
| Expert       | خبير    | 4    |

---

## 💡 Skills (10)

| English              | Arabic                              |
|----------------------|-------------------------------------|
| C# / .NET            | سي شارب / دوت نت                   |
| React                | رياكت                               |
| Angular              | أنجولار                             |
| Python               | بايثون                              |
| SQL Server           | أس كيو إل سيرفر                    |
| Docker & Containers  | دوكر والحاويات                     |
| TypeScript           | تايب سكريبت                        |
| DevOps & CI/CD       | تطوير العمليات والتكامل المستمر    |
| UI/UX Design         | تصميم واجهة وتجربة المستخدم        |
| Project Management   | إدارة المشاريع                     |

---

## 🔑 Operation Keys (History Audit)

`CREATE` · `UPDATE` · `DELETE` · `LOGIN` · `LOGOUT` · `ASSIGN_SKILL` · `CHANGE_STATUS`

---

## 📁 Projects

| Serial        | Name (EN)                            | Status      | Manager |
|---------------|--------------------------------------|-------------|---------|
| PRJ-2026-001  | Smart Project & Skill Management     | In Progress | admin   |
| PRJ-2026-002  | E-Services Portal                    | Pending     | master  |
| PRJ-2026-003  | HR & Payroll System                  | Completed   | admin   |

---

## 🧑‍💻 Employee Skills

| User   | Skill          | Level        |
|--------|----------------|--------------|
| admin  | C# / .NET      | Expert       |
| admin  | SQL Server     | Advanced     |
| master | React          | Advanced     |
| master | Docker         | Intermediate |

---

## 🌐 Production URL

- **API + Scalar Docs**: [http://apiems.runasp.net/](http://apiems.runasp.net/) → redirects to `/scalar/v1`
