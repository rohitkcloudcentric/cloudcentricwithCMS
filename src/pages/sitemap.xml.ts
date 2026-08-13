import { GetServerSideProps } from "next";
import { generateSitemapXml } from "@/lib/sitemap-helper";

export default function Sitemap() {
  // Server-side response will handle serving XML directly
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemapXml = generateSitemapXml();

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200");
  res.write(sitemapXml);
  res.end();

  return {
    props: {},
  };
};
