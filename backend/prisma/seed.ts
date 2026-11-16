import { PrismaClient, ContentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CloudCentric CMS database seeding from backend module...");

  // 1. Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: "Super Admin" },
    update: {},
    create: {
      name: "Super Admin",
      description: "Full unrestricted access to system configurations, user management, audit logs, and all content modules.",
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: "Editor" },
    update: {},
    create: {
      name: "Editor",
      description: "Full CRUD and publishing permissions across all content modules (Blogs, Case Studies, Products).",
    },
  });

  const authorRole = await prisma.role.upsert({
    where: { name: "Author" },
    update: {},
    create: {
      name: "Author",
      description: "Can create and edit their own drafts; cannot publish directly or manage other content.",
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: "Viewer" },
    update: {},
    create: {
      name: "Viewer",
      description: "Read-only access to analytics, audit logs, and content preview modes.",
    },
  });

  console.log("✅ Roles verified");

  // 2. Create Permissions
  const modules = ["blogs", "case_studies", "products", "users", "settings", "audit_logs"];
  const actions = ["create", "read", "update", "delete", "publish"];

  for (const moduleName of modules) {
    for (const actionName of actions) {
      if (moduleName === "audit_logs" && actionName !== "read") continue;
      await prisma.permission.upsert({
        where: {
          module_action: {
            module: moduleName,
            action: actionName,
          },
        },
        update: {},
        create: {
          module: moduleName,
          action: actionName,
          description: `Permission to ${actionName} ${moduleName}`,
        },
      });
    }
  }

  // Assign permissions to Super Admin
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: perm.id,
      },
    });
  }

  console.log("✅ Permissions matrix configured");

  // 3. First Super Admin: credentials come from the environment, never from source code.
  //    Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (and optionally SEED_ADMIN_NAME) before seeding.
  //    An existing account is never modified (its password stays whatever the owner set).
  const seedEmail = (process.env.SEED_ADMIN_EMAIL || "").trim().toLowerCase();
  const seedPassword = process.env.SEED_ADMIN_PASSWORD || "";
  let superAdminUser = seedEmail ? await prisma.user.findUnique({ where: { email: seedEmail } }) : null;
  if (!superAdminUser && seedEmail) {
    if (seedPassword.length < 12) throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters.");
    superAdminUser = await prisma.user.create({
      data: {
        email: seedEmail,
        name: process.env.SEED_ADMIN_NAME || "Administrator",
        passwordHash: await bcrypt.hash(seedPassword, 12),
        roleId: superAdminRole.id,
        isActive: true,
      },
    });
    console.log(`✅ Super Admin user created (${seedEmail})`);
  }
  // Sample content needs an author: fall back to any existing full-access user
  superAdminUser ??= await prisma.user.findFirst({ where: { role: { fullAccess: true } }, orderBy: { createdAt: "asc" } });
  if (!superAdminUser) {
    throw new Error("No admin user exists. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD, then run the seed again.");
  }

  // 4. Seed Categories
  const categoriesData = [
    { name: "AI & Automation", slug: "ai-automation" },
    { name: "Digital Transformation", slug: "digital-transformation" },
    { name: "Technology", slug: "technology" },
    { name: "Salesforce", slug: "salesforce" },
    { name: "Cloud Services", slug: "cloud-services" },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoriesMap[cat.name] = created.id;
  }

  console.log("✅ Categories verified");

  // 5. Seed Sample Blog Articles
  const blogArticles = [
    {
      title: "How AI Agents Are Changing Business Operations",
      slug: "how-ai-agents-are-changing-business-automation",
      categoryName: "AI & Automation",
      excerpt: "Artificial intelligence is moving beyond chatbots and content generation. Businesses are increasingly looking at AI systems that can understand goals, make decisions, and complete tasks.",
      contentHtml: `<p>Artificial intelligence is moving beyond chatbots and content generation. Businesses are increasingly looking at AI systems that can understand goals, make decisions, and complete tasks.</p><h2>The Evolution of AI in Business</h2><p>Modern enterprise platforms integrate autonomous agents capable of performing complex multi-step routines with minimal human friction.</p>`,
      featuredImage: "/images/blogs/how-ai-agents-are-changing-business-automation.png",
      readTime: "5 MIN READ",
      seoTitle: "How AI Agents Are Changing Business Operations | CloudCentric",
      seoDescription: "Explore how autonomous AI agents transform enterprise operations by executing complex decisions, automating workflows, and driving operational efficiency.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-08-14"),
    },
    {
      title: "AI Agents vs Traditional Automation: What's the Difference?",
      slug: "ai-agents-vs-traditional-automation",
      categoryName: "AI & Automation",
      excerpt: "Understand where AI agents fit into modern business automation compared to traditional rule-based workflows and RPA systems.",
      contentHtml: `<p>Understand where AI agents fit into modern business automation compared to traditional rule-based workflows and RPA systems.</p><h2>RPA vs Autonomous Agents</h2><p>RPA relies on static rules while AI agents adapt dynamically to unstructured inputs.</p>`,
      featuredImage: "/images/blogs/ai-agents-vs-traditional-automation.png",
      readTime: "5 MIN READ",
      seoTitle: "AI Agents vs Traditional Automation: What's the Difference?",
      seoDescription: "Compare autonomous AI agents vs traditional RPA and rule-based automation. Learn when to implement AI agents for complex enterprise workflow automation.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-08-14"),
    },
    {
      title: "Why AI Integration Matters for Modern Businesses",
      slug: "why-ai-integration-matters-for-modern-businesses",
      categoryName: "Digital Transformation",
      excerpt: "Artificial intelligence is no longer limited to standalone chatbots, content generation tools, or experimental applications. Learn why connecting AI with your existing systems is key to business growth.",
      contentHtml: `<p>Connecting AI with your enterprise infrastructure unlocks massive synergy, real-time analytics, and automated operations.</p>`,
      featuredImage: "/images/blogs/why-ai-integration-matters-for-modern-businesses.png",
      readTime: "6 MIN READ",
      seoTitle: "Why AI Integration Matters for Modern Businesses",
      seoDescription: "Discover why integrating AI with enterprise CRM, cloud infrastructure, and databases is essential for modern business scalability and real-time insights.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-08-14"),
    },
    {
      title: "How to Choose an AI Development Company",
      slug: "how-to-choose-an-ai-development-company",
      categoryName: "Technology",
      excerpt: "Selecting the right AI development company is critical to your project's success. Learn the key factors to evaluate, from business understanding to integration capabilities.",
      contentHtml: `<p>Evaluating an AI partner requires looking beyond superficial demos to security standards, architectural agility, and proven ROI.</p>`,
      featuredImage: "/images/blogs/how-to-choose-an-ai-development-company.png",
      readTime: "7 MIN READ",
      seoTitle: "How to Choose an AI Development Company",
      seoDescription: "Essential evaluation criteria for choosing an AI development company. Compare technical expertise, enterprise security standards, integration capabilities, and ROI.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-08-14"),
    },
  ];

  for (const article of blogArticles) {
    const catId = categoriesMap[article.categoryName] || categoriesMap["AI & Automation"];
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        contentHtml: article.contentHtml,
        featuredImage: article.featuredImage,
        readTime: article.readTime,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        status: article.status,
        publishedAt: article.publishedAt,
        authorId: superAdminUser.id,
        categoryId: catId,
      },
    });
  }

  console.log("✅ Blog Articles verified");

  // 6. Seed Case Studies
  const caseStudiesData = [
    {
      title: "AI-Powered Automation for Faster, Smarter Business Operations",
      slug: "automating-business-operations-with-ai",
      clientName: "ABC PVT LTD",
      industry: "MANUFACTURING",
      summary: "We helped transform manual, repetitive business processes into intelligent workflows using AI-powered automation–reducing operational effort, improving productivity, and creating a more scalable way of working.",
      challenge: "Too Much Manual Work. Too Little Time. The business relied on repetitive manual processes across teams, resulting in delays, duplicated effort, inconsistent data, and limited visibility.",
      solution: "We analyzed existing workflows and designed an intelligent automation layer capable of understanding requests, processing information, triggering workflows, and assisting teams with routine operational tasks.",
      results: "FASTER OPERATIONS, HIGHER PRODUCTIVITY, BETTER SCALABILITY",
      featuredImage: "/images/case-studies/case-studies-1.png",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Building a Scalable Salesforce Ecosystem",
      slug: "scaling-enterprise-support-salesforce-agentforce",
      clientName: "GLOBAL TELECOM",
      industry: "TELECOMMUNICATIONS",
      summary: "High ticket volumes and delayed support responses were impacting customer satisfaction scores.",
      challenge: "High customer query volume leading to agent burnout and delayed SLA resolution.",
      solution: "Deployed autonomous Salesforce Agentforce assistants to handle complex tier-1 queries in real time.",
      results: "64% DEFLECTION, SUB-MINUTE RESOLUTION, 24/7 AVAILABILITY",
      featuredImage: "/images/case-studies/case-studies-2.png",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  ];

  for (const cs of caseStudiesData) {
    await prisma.caseStudy.upsert({
      where: { slug: cs.slug },
      update: {},
      create: cs,
    });
  }

  console.log("✅ Case Studies verified");

  // 7. Seed Products
  const productsData = [
    {
      title: "FieldBlaze",
      slug: "fieldblaze",
      description: "Effortlessly manage your field workforce with real-time tracking, order automation, attendance monitoring, and expense tracking. Built on Salesforce, FieldBlaze ensures unmatched security, scalability, and process optimization.",
      badge: "Field Force Management Software Built on Salesforce",
      logoUrl: "/images/products/fieldblaze-product-img.png",
      features: [
        "Real-Time Location Tracking",
        "Inventory & Visit Management",
        "Order & Task Assignment",
        "Attendance & Expense Automation"
      ],
      websiteUrl: "http://fieldblaze.com/",
    },
    {
      title: "FlyBlaze",
      slug: "flyblaze",
      description: "The Ultimate Tech Solution for Your Travel Business. Empower your travel agency with a ready-to-use platform that simplifies flight and hotel bookings, streamlines operations, and increases revenue with real-time availability and secure transactions.",
      badge: "White-Label Travel Portal for Agencies & Businesses",
      logoUrl: "/images/products/flyblaze-product-img.png",
      features: [
        "All-in-One Booking Platform",
        "Seamless API Integrations",
        "Flights & Hotel Inventory Integration",
        "Automated Billing & Payment Gateways"
      ],
      websiteUrl: "http://flyblaze.com/",
    },
    {
      title: "C3 Messenger",
      slug: "c3messenger",
      description: "Multi-channel messaging hub connecting CRM triggers with WhatsApp, SMS, Slack, and email channels instantly. Send notifications, campaign updates, and marketing broadcasts.",
      badge: "WhatsApp Marketing & Omnichannel CRM Triggers",
      logoUrl: "/images/products/C3Messenger-–-WhatsApp-Marketing-Tool.png",
      features: [
        "CRM Communication Hub",
        "WhatsApp Marketing Tools",
        "Campaign Broadcasts Engine",
        "Real-time Notification Delivery"
      ],
      websiteUrl: "https://messagify.net/",
    },
    {
      title: "Hoopmein",
      slug: "hoopmein",
      description: "Connect people around team activities, sports matches, and local events. Create matches, track attendance, manage RSVP, and chat with team members in one place.",
      badge: "Social Collaboration & Community Events Portal",
      logoUrl: "/images/products/hoopmein-product-img.png",
      features: [
        "Event Scheduling & Invites",
        "RSVP & Roster Controls",
        "Interactive Group Chat",
        "Community Activity Streams"
      ],
      websiteUrl: "https://hoopmein.com/",
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }

  console.log("✅ Products verified");
  console.log("🎉 Backend seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
