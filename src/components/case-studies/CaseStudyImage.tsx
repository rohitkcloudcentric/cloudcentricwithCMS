import Image from "next/image";

interface CaseStudyImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

/**
 * Fills its (relative-positioned) parent.
 * Local paths go through next/image (resized + modern formats); external URLs
 * that aren't whitelisted in next.config fall back to a lazy-loaded <img>.
 */
export default function CaseStudyImage({ src, alt, sizes, className = "", priority = false }: CaseStudyImageProps) {
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
