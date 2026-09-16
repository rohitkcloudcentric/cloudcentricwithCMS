# CloudCentric CMS - Dedicated Backend Architecture

This directory houses the complete backend architecture for the CloudCentric Headless Content Management System (CMS), modularized cleanly into Prisma models, data services, RBAC security helpers, and controller abstractions.

---

## 📁 Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema definitions & PostgreSQL mappings
│   └── seed.ts              # Database seeder (Roles, Permissions, Admins, Articles)
├── lib/
│   ├── prisma.ts            # Prisma client singleton & connection manager
│   ├── auth.ts              # JWT signing, verification, bcrypt password hashing
│   └── rbac.ts              # RBAC permission middleware & authorization matrix
└── services/
    ├── articleService.ts    # Blog article query & mutation data service
    ├── caseStudyService.ts  # Enterprise case study management data service
    ├── productService.ts   # Product portfolio data service
    ├── userService.ts       # User management & role assignment service
    └── auditLogService.ts   # System activity & audit logging service
```

---

## 🗄️ Database Integration

- **Provider**: PostgreSQL
- **Database Name**: `cloudcentricwithCSM`
- **ORM**: Prisma ORM (v6.4.0)
- **Tables**: `User`, `Role`, `Permission`, `RolePermission`, `Session`, `BlogArticle`, `CaseStudy`, `Product`, `Category`, `Tag`, `ArticleTag`, `AuditLog`.

---

## 🔐 Security Model & RBAC Roles

- **Super Admin**: Full unrestricted access across system configuration, user roles, content modules, and audit trails.
- **Editor**: Full CRUD and publishing capabilities across Blog Articles, Case Studies, and Products.
- **Author**: Draft creation and editing rights for owned articles.
- **Viewer**: Read-only preview access to content and logs.

---

## 🚀 Commands

- **Sync Schema**: `npx prisma db push`
- **Generate Client**: `npx prisma generate`
- **Seed Database**: `npx prisma db seed`
