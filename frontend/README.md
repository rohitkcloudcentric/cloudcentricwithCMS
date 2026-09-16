# CloudCentric CMS - Dedicated Frontend Architecture

This directory houses the complete frontend codebase for CloudCentric's web application and Headless CMS Admin UI.

---

## 📁 Directory Structure

```
frontend/
├── components/          # Reusable UI component modules
│   ├── admin/           # Admin Dashboard layout & navigation header
│   ├── blogs/           # Blog listing cards, hero, & metadata components
│   ├── case-studies/    # Case study cards, detail hero & impact components
│   ├── products/        # Product showcase cards & SaaS platform badges
│   ├── common/          # Global navigation, footer, buttons, badge components
│   ├── contact/         # Salesforce Pardot contact form integration
│   ├── home/            # Homepage hero, services banner, AI capabilities grid
│   ├── our-clients/     # Client logos showcase
│   ├── seo/             # NextSeo & Schema.org JSON-LD structured data generators
│   ├── services/        # Service detail pages & capability matrices
│   └── who-we-are/      # About Us timeline & leadership section
├── pages/               # Next.js Pages Router view pages
│   ├── admin/           # CMS Admin UI (/admin, /admin/blogs, /admin/case-studies, etc.)
│   ├── blogs/           # Public Blog pages (/blogs, /blogs/[slug])
│   ├── case-studies/    # Public Case Studies (/case-studies, /case-studies/[slug])
│   ├── products/        # Public Products portfolio (/products)
│   ├── _app.tsx         # Root React Application wrapper
│   ├── _document.tsx    # HTML document structure
│   └── globals.css      # Tailwind CSS v4 styling & global animations
├── config/              # SEO & site configuration constants
└── public/              # Static media assets, hero banners, client logos & uploads
```

---

## 🎨 Tech Stack & Design Architecture

- **Framework**: Next.js 16 (React 19, TypeScript)
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism Utilities
- **Animations**: Framer Motion & CSS Micro-Interactions
- **Icons**: Lucide React
- **Forms**: React Hook Form, Zod validation
