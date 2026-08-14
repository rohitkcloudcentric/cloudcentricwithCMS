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
