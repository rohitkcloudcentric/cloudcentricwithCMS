export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cloudcentric.in";
export const SITE_NAME = "CloudCentric";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-banner.png`;

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  ogType?: "website" | "article";
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

export const DEFAULT_SEO: SEOProps = {
  title: "CloudCentric | Enterprise AI & Cloud Transformation Experts",
  description:
    "CloudCentric builds intelligent AI agents, custom Salesforce solutions, cloud native software, and enterprise automation engines to drive digital transformation.",
  canonical: SITE_URL,
  noindex: false,
  ogType: "website",
  ogImage: DEFAULT_OG_IMAGE,
};
