import { SITE_URL, SITE_NAME } from "@/config/seo.config";
import { SAMPLE_BLOG_POSTS } from "@/components/blogs/BlogListing";
import { SAMPLE_CASE_STUDIES } from "@/components/case-studies/CaseStudyListing";
import { PRODUCTS } from "@/components/products/ProductCard";

export interface SitemapLocation {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export const SITEMAP_LIMIT = 50000;

export function getStaticRoutes(): SitemapLocation[] {
  const now = new Date().toISOString();
  return [
    { url: `${SITE_URL}`, lastmod: now, changefreq: "daily", priority: 1.0 },
    { url: `${SITE_URL}/who-we-are`, lastmod: now, changefreq: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/what-we-do`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/services`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/salesforce/services`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/salesforce/ai-solutions`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/salesforce/cloud-integration`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/salesforce/custom-development`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/salesforce/growth-digital-experience`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/growth-digital-experience`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/our-clients`, lastmod: now, changefreq: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact-us`, lastmod: now, changefreq: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy`, lastmod: now, changefreq: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`, lastmod: now, changefreq: "yearly", priority: 0.3 },
  ];
}


export function getBlogSitemapRoutes(): SitemapLocation[] {
  const now = new Date().toISOString();
  
  // Base parent pages
  const baseRoutes: SitemapLocation[] = [
    { url: `${SITE_URL}/blogs`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastmod: now, changefreq: "daily", priority: 0.8 },
  ];

  // Dynamic posts (ignore noindex or draft posts if those properties exist in future extensions)
  const dynamicRoutes: SitemapLocation[] = SAMPLE_BLOG_POSTS
    .filter((post: any) => !post.draft && !post.noindex)
    .flatMap((post) => [
      {
        url: `${SITE_URL}/blogs/${post.slug}`,
        lastmod: post.date ? new Date(post.date).toISOString() : now,
        changefreq: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/blog/${post.slug}`,
        lastmod: post.date ? new Date(post.date).toISOString() : now,
        changefreq: "weekly" as const,
        priority: 0.7,
      }
    ]);

  return [...baseRoutes, ...dynamicRoutes];
}

export function getCaseStudySitemapRoutes(): SitemapLocation[] {
  const now = new Date().toISOString();

  // Base parent page
  const baseRoutes: SitemapLocation[] = [
    { url: `${SITE_URL}/case-studies`, lastmod: now, changefreq: "weekly", priority: 0.8 },
  ];

  // Dynamic items
  const dynamicRoutes: SitemapLocation[] = SAMPLE_CASE_STUDIES
    .filter((post: any) => !post.draft && !post.noindex)
    .map((post) => ({
      url: `${SITE_URL}/case-studies/${post.slug}`,
      lastmod: now, // Case studies use the current compile/server timestamp
      changefreq: "weekly" as const,
      priority: 0.7,
    }));

  return [...baseRoutes, ...dynamicRoutes];
}

export function getProductSitemapRoutes(): SitemapLocation[] {
  const now = new Date().toISOString();

  // Base parent page
  const baseRoutes: SitemapLocation[] = [
    { url: `${SITE_URL}/products`, lastmod: now, changefreq: "monthly", priority: 0.9 },
  ];

  // Dynamic products using product slugs
  const dynamicRoutes: SitemapLocation[] = PRODUCTS
    .filter((product: any) => !product.draft && !product.noindex)
    .map((product) => ({
      url: `${SITE_URL}/products/${product.id}`,
      lastmod: now,
      changefreq: "monthly" as const,
      priority: 0.7,
    }));

  return [...baseRoutes, ...dynamicRoutes];
}

export function getChildSitemaps(): string[] {
  const sitemaps: string[] = [];

  // Page sitemap
  sitemaps.push(`${SITE_URL}/page-sitemap.xml`);

  // Blog sitemap pagination check
  const blogRoutes = getBlogSitemapRoutes();
  if (blogRoutes.length > SITEMAP_LIMIT) {
    const pages = Math.ceil(blogRoutes.length / SITEMAP_LIMIT);
    for (let i = 1; i <= pages; i++) {
      sitemaps.push(`${SITE_URL}/blog-sitemap-${i}.xml`);
    }
  } else {
    sitemaps.push(`${SITE_URL}/blog-sitemap.xml`);
  }

  // Case Study sitemap pagination check
  const caseStudyRoutes = getCaseStudySitemapRoutes();
  if (caseStudyRoutes.length > SITEMAP_LIMIT) {
    const pages = Math.ceil(caseStudyRoutes.length / SITEMAP_LIMIT);
    for (let i = 1; i <= pages; i++) {
      sitemaps.push(`${SITE_URL}/case-study-sitemap-${i}.xml`);
    }
  } else {
    sitemaps.push(`${SITE_URL}/case-study-sitemap.xml`);
  }

  // Product sitemap pagination check
  const productRoutes = getProductSitemapRoutes();
  if (productRoutes.length > SITEMAP_LIMIT) {
    const pages = Math.ceil(productRoutes.length / SITEMAP_LIMIT);
    for (let i = 1; i <= pages; i++) {
      sitemaps.push(`${SITE_URL}/product-sitemap-${i}.xml`);
    }
  } else {
    sitemaps.push(`${SITE_URL}/product-sitemap.xml`);
  }

  return sitemaps;
}

export function generateSitemapIndexXml(childSitemaps: string[]): string {
  const xmlSitemaps = childSitemaps
    .map(
      (loc) => `  <sitemap>
    <loc>${loc}</loc>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlSitemaps}
</sitemapindex>`;
}

export function generateSitemapUrlsetXml(routes: SitemapLocation[]): string {
  const xmlUrls = routes
    .map(
      (route) => `  <url>
    <loc>${route.url}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ""}
    ${route.changefreq ? `<changefreq>${route.changefreq}</changefreq>` : ""}
    ${route.priority !== undefined ? `<priority>${route.priority.toFixed(1)}</priority>` : ""}
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

// Global Organization Schema
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CloudCentric Infotech",
  "alternateName": "CloudCentric AI",
  "url": "https://cloudcentric.in/",
  "logo": "https://cloudcentric.in/logo.svg",
  "sameAs": [
    "https://www.facebook.com/cloudcentricinfotech/",
    "https://x.com/CCCInfotech",
    "https://www.instagram.com/cccinfotech/",
    "https://www.youtube.com/channel/UC21Gs_6xh8PF1nc8-XIyHJg",
    "https://www.linkedin.com/company/cccinfotech/",
    "https://cccinfotech.com/"
  ]
};

// Global Website Schema
export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org/",
  "@type": "WebSite",
  "name": "CloudCentric Infotech",
  "url": "https://cloudcentric.in/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://cloudcentric.in/blogs?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// LocalBusiness Schema
export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "CloudCentric Infotech",
  "image": "https://cloudcentric.in/",
  "url": "https://cloudcentric.in/",
  "telephone": "9971126721",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "H-146 & 147, H Block, Sector 63",
    "addressLocality": "Noida",
    "postalCode": "201301",
    "addressCountry": "IN"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "10:00",
    "closes": "18:00"
  }
};

// Products Schema
export const PRODUCT_SCHEMAS = [
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "FlyBlaze",
    "image": "https://flyblaze.com/wp-content/uploads/2025/04/FlyBlaze-Logo.svg",
    "description": "FlyBlaze is a travel technology / SaaS platform that helps travel businesses launch and operate their own branded online booking platforms.",
    "brand": {
      "@type": "Brand",
      "name": "Cloudcentric Infotech"
    }
  },
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "FieldBlaze",
    "image": "https://fieldblaze.com/wp-content/uploads/2024/01/fieldblaze-header-logo.png.webp",
    "description": "FieldBlaze helps businesses track, manage, and coordinate their field sales teams from one platform.",
    "brand": {
      "@type": "Brand",
      "name": "CloudCentric Infotech"
    }
  },
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "HoopMein",
    "image": "https://hoopmein.com/assets/images/uploads/2024/02/3169599.png",
    "description": "HoopMein is a mobile app focused on location-based field activity and Salesforce-connected CRM operations. It appears to be particularly useful for field sales/service teams that need to manage customer interactions while working outside the office.",
    "brand": {
      "@type": "Brand",
      "name": "CloudCentric Infotech"
    }
  },
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Messagify",
    "image": "https://www.messagify.net/img/messagify-logo.svg",
    "description": "Messagify is a business messaging and communication platform that helps companies send bulk and transactional messages through channels such as WhatsApp and SMS, with APIs and integrations for CRM/helpdesk platforms.",
    "brand": {
      "@type": "Brand",
      "name": "CloudCentric Infotech"
    }
  }
];

// FAQ Schema
export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does CloudCentric Infotech offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We help businesses build AI strategy roadmaps, deploy custom AI agents, implement intelligent automation, integrate generative AI into customer service, connect AI models with existing systems (CRM, cloud platforms, APIs), and develop bespoke AI solutions tailored to specific industries."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between AI automation and AI agents?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Automation connects and streamlines existing workflows and systems. AI agents go further — they're autonomous, can make decisions, and actively complete multi-step tasks such as resolving customer queries or managing operational bottlenecks without constant human input."
      }
    },
    {
      "@type": "Question",
      "name": "Do you build custom AI models, or use existing ones like GPT or Claude?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Both, depending on your needs. For most businesses, we integrate and fine-tune leading models (OpenAI, Anthropic, Llama, Gemini, and others) rather than training from scratch — this is faster and more cost-effective. For specialized use cases with unique compliance or performance requirements, we design and train bespoke models."
      }
    },
    {
      "@type": "Question",
      "name": "How long does an AI implementation typically take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This depends on scope — a focused AI agent deployment might take a few weeks, while a full AI strategy-to-integration engagement across multiple systems can take a few months. We start every engagement with a strategy session to scope this accurately for your case."
      }
    },
    {
      "@type": "Question",
      "name": "How much does an AI project cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cost depends on scope, complexity, and the systems involved. Budget bands typically range from $5k–$10k, $10k–$25k, $25k–$50k, and $50k+ tiers depending on requirements."
      }
    },
    {
      "@type": "Question",
      "name": "What is the average cost of building a custom AI agent?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A custom AI agent generally falls in the $10,000–$25,000 range depending on complexity — simple task-based agents cost less, while agents that integrate with multiple systems or handle nuanced decision-making cost more."
      }
    },
    {
      "@type": "Question",
      "name": "Is AI implementation worth it for small and mid-sized businesses?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, when scoped correctly — the highest ROI usually comes from automating repetitive, high-volume tasks (support tickets, data entry, scheduling) rather than attempting a full AI overhaul. Starting with a focused pilot is the most cost-effective way to validate ROI before scaling."
      }
    },
    {
      "@type": "Question",
      "name": "How do I choose the right AI development company?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Look for a vendor with a clear strategy-first approach (not just implementation), experience across multiple AI models rather than a single vendor lock-in, transparent pricing, and existing case studies or client references in your industry."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best AI company in India for enterprise AI solutions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This depends on your specific needs — Salesforce-integrated AI, standalone automation, or industry-specific solutions each favor different specialists. Look for Great Place to Work-certified companies with verified client reviews (Clutch, G2) and a track record across multiple AI models rather than a single-platform focus."
      }
    },
    {
      "@type": "Question",
      "name": "Which AI model is best for business — GPT, Claude, or Gemini?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There's no universal \"best\" — GPT models are strong for general-purpose tasks, Claude tends to excel at nuanced reasoning and longer documents, and Gemini integrates tightly with Google Workspace. The right choice depends on your specific use case, existing tech stack, and data requirements — many businesses use more than one model for different tasks."
      }
    },
    {
      "@type": "Question",
      "name": "Generative AI vs traditional automation — what's the difference?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Traditional automation follows fixed rules for repetitive tasks (if X happens, do Y). Generative AI understands context and unstructured input, generating human-like responses — useful when tasks require judgment or natural language understanding rather than a fixed script."
      }
    },
    {
      "@type": "Question",
      "name": "AI agents vs chatbots — what's the difference?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Chatbots typically follow scripted decision trees and handle a narrow set of predefined questions. AI agents are autonomous — they can make decisions, take multi-step actions, and complete tasks (like resolving a support ticket end-to-end) rather than just answering FAQs."
      }
    },
    {
      "@type": "Question",
      "name": "Is it safe to connect company data to AI models like ChatGPT or Claude?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It can be, with the right safeguards — this includes controlling what data is sent to third-party AI providers, using enterprise-tier API agreements (which typically don't train on your data), and keeping sensitive data within your own infrastructure where possible."
      }
    },
    {
      "@type": "Question",
      "name": "What compliance standards should an AI vendor follow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This varies by industry — healthcare typically requires HIPAA-aligned handling, finance often requires SOC 2 or similar controls, and general data protection should align with regulations like GDPR where applicable. Ask any AI vendor directly which certifications and data-handling practices they follow."
      }
    },
    {
      "@type": "Question",
      "name": "How do I integrate AI into my existing CRM or ERP system?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Integration typically happens through APIs connecting your CRM/ERP to the AI model or automation layer — this lets AI agents read and act on your existing data without requiring a system migration."
      }
    },
    {
      "@type": "Question",
      "name": "How long does it take to implement an AI agent for customer service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A focused customer-service AI agent typically takes 4–8 weeks from strategy to launch, depending on integration complexity with existing support systems."
      }
    },
    {
      "@type": "Question",
      "name": "How do I start using AI in my business with no technical team?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with an AI strategy session to identify high-impact, low-complexity opportunities. Most AI vendors handle the technical implementation, and solutions can be designed for non-technical teams to operate day-to-day."
      }
    }
  ]
};

// Breadcrumb generator helper
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
    }))
  };
}
