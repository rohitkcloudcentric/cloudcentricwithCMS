import { GetServerSideProps } from "next";
import {
  getStaticRoutes,
  getBlogSitemapRoutes,
  getCaseStudySitemapRoutes,
  getProductSitemapRoutes,
  getChildSitemaps,
  generateSitemapIndexXml,
  generateSitemapUrlsetXml,
  SitemapLocation,
  SITEMAP_LIMIT,
} from "@/lib/sitemap-helper";
import { getPublishedBlogSlugs } from "@/lib/blog-data";
import { getPublishedCaseStudySlugs } from "@/lib/case-study-data";
import { getPublishedProductSlugs } from "@/lib/product-data";

export default function Sitemap() {
  // Server-side response will handle serving XML directly
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const sitemapParam = params?.sitemap as string;

  if (!sitemapParam || !sitemapParam.endsWith(".xml")) {
    res.statusCode = 404;
    res.end();
    return { props: {} };
  }

  // Extract sitemap type by removing the .xml extension
  const sitemap = sitemapParam.replace(/\.xml$/, "");
  let xmlContent = "";

  // 1. Main Sitemap Index
  if (sitemap === "sitemap") {
    const [blogSlugs, caseStudySlugs, productSlugs] = await Promise.all([
      getPublishedBlogSlugs(),
      getPublishedCaseStudySlugs(),
      getPublishedProductSlugs(),
    ]);
    const childSitemaps = getChildSitemaps(blogSlugs, caseStudySlugs, productSlugs);
    xmlContent = generateSitemapIndexXml(childSitemaps);
  } else {
    // 2. Child Sitemap Pages
    let type = sitemap;
    let page = 1;
    
    // Parse pagination suffix: e.g. "blog-sitemap-2"
    const paginationMatch = sitemap.match(/^(.+)-(\d+)$/);
    if (paginationMatch) {
      type = paginationMatch[1];
      page = parseInt(paginationMatch[2], 10);
    }

    let allRoutes: SitemapLocation[] = [];

    switch (type) {
      case "page-sitemap":
        allRoutes = getStaticRoutes();
        break;
      case "blog-sitemap":
        allRoutes = getBlogSitemapRoutes(await getPublishedBlogSlugs());
        break;
      case "case-study-sitemap":
        allRoutes = getCaseStudySitemapRoutes(await getPublishedCaseStudySlugs());
        break;
      case "product-sitemap":
        allRoutes = getProductSitemapRoutes(await getPublishedProductSlugs());
        break;
      default:
        res.statusCode = 404;
        res.end();
        return { props: {} };
    }

    // Paginate routes
    const startIndex = (page - 1) * SITEMAP_LIMIT;
    const pageRoutes = allRoutes.slice(startIndex, startIndex + SITEMAP_LIMIT);

    // Return 404 for out of range page numbers (e.g. blog-sitemap-2.xml when only 1 page exists)
    if (pageRoutes.length === 0 && page > 1) {
      res.statusCode = 404;
      res.end();
      return { props: {} };
    }

    xmlContent = generateSitemapUrlsetXml(pageRoutes);
  }

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=43200");
  res.write(xmlContent);
  res.end();

  return {
    props: {},
  };
};
