/** Public (website) shape of a product, serialisable for getServerSideProps. */
export interface ProductPost {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  shortDescription: string;
  /** Logo / thumbnail ("" when none) */
  logo: string;
  /** Card / banner image: featured image, else logo ("" when none) */
  image: string;
  features: string[];
  technologies: string[];
  websiteUrl: string;
  // Detail-only fields
  featuredImage?: string;
  featuredImageAlt?: string;
  contentHtml?: string;
  gallery?: { url: string; alt: string }[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: string;
}
