import Head from "next/head";
import { useRouter } from "next/router";
import { DEFAULT_SEO, SITE_NAME, SITE_URL, SEOProps } from "@/config/seo.config";
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from "@/lib/sitemap-helper";

export default function SEOHead({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  canonical,
  noindex = false,
  ogType = DEFAULT_SEO.ogType,
  ogImage = DEFAULT_SEO.ogImage,
  publishedTime,
  modifiedTime,
  authorName,
  jsonLd,
}: SEOProps) {
  const router = useRouter();
  
  // Format clean canonical URL
  const cleanPath = router?.asPath ? router.asPath.split("?")[0] : "";
  const canonicalUrl = canonical || `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
  const fullOgImage = ogImage?.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  const customSchemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const schemasToRender = [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, ...customSchemas];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph Tags */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {authorName && <meta property="article:author" content={authorName} />}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@CloudCentric" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Structured Data (JSON-LD) */}
      {schemasToRender.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}

