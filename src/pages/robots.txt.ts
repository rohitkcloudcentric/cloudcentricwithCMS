import { GetServerSideProps } from "next";
import { SITE_URL } from "@/config/seo.config";

export default function Robots() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = `User-agent: *
Allow: /

# Exclude non-indexable routes if any
Disallow: /api/
Disallow: /_next/

# Host & Sitemap reference
Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200");
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};
