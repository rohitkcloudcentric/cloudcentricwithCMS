import { SITE_URL, SITE_NAME } from "@/config/seo.config";
import { SAMPLE_BLOG_POSTS } from "@/components/blogs/BlogListing";
import { SAMPLE_CASE_STUDIES } from "@/components/case-studies/CaseStudyListing";

export interface SitemapLocation {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export function getStaticRoutes(): SitemapLocation[] {
  const now = new Date().toISOString();
  return [
    { url: `${SITE_URL}`, lastmod: now, changefreq: "daily", priority: 1.0 },
    { url: `${SITE_URL}/who-we-are`, lastmod: now, changefreq: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/what-we-do`, lastmod: now, changefreq: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/case-studies`, lastmod: now, changefreq: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blogs`, lastmod: now, changefreq: "daily", priority: 0.8 },
    { url: `${SITE_URL}/our-clients`, lastmod: now, changefreq: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact-us`, lastmod: now, changefreq: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy-policy`, lastmod: now, changefreq: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms-and-conditions`, lastmod: now, changefreq: "yearly", priority: 0.3 },
  ];
}

export function getDynamicRoutes(): SitemapLocation[] {
  const now = new Date().toISOString();
  
  const blogRoutes: SitemapLocation[] = SAMPLE_BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blogs/${post.slug}`,
    lastmod: now,
    changefreq: "weekly",
    priority: 0.7,
  }));

  const caseStudyRoutes: SitemapLocation[] = SAMPLE_CASE_STUDIES.map((post) => ({
    url: `${SITE_URL}/case-studies/${post.slug}`,
    lastmod: now,
    changefreq: "weekly",
    priority: 0.7,
  }));

  return [...blogRoutes, ...caseStudyRoutes];
}

export function generateSitemapXml(): string {
  const staticRoutes = getStaticRoutes();
  const dynamicRoutes = getDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const xmlUrls = allRoutes
    .map(
      (route) => `
  <url>
    <loc>${route.url}</loc>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ""}
    ${route.changefreq ? `<changefreq>${route.changefreq}</changefreq>` : ""}
    ${route.priority !== undefined ? `<priority>${route.priority.toFixed(1)}</priority>` : ""}
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

// Global Organization Schema
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SITE_NAME,
  "url": SITE_URL,
  "logo": `${SITE_URL}/images/Logo.svg`,
  "sameAs": [
    "https://twitter.com/CloudCentric",
    "https://linkedin.com/company/cloudcentric"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@cloudcentric.com"
  }
};

// Global Website Schema
export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": SITE_URL,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_URL}/blogs?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
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
