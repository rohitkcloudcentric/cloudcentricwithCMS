import Link from "next/link";
import { ExternalLink, MoveRight, Check } from "lucide-react";
import CaseStudyImage from "@/components/case-studies/CaseStudyImage";
import type { ProductPost } from "./product-types";

const MONO = { fontFamily: "var(--font-intel-one-mono), monospace" } as const;
const DURU = { fontFamily: "var(--font-duru-sans), sans-serif" } as const;

// Same rich-text styling as the case study article (content comes from the CMS, already sanitized)
const RICH_TEXT = [
  "space-y-4 text-sm sm:text-base text-white/70 leading-relaxed font-light",
  "[&_strong:not([class])]:text-white [&_strong:not([class])]:font-bold [&_b:not([class])]:text-white [&_b:not([class])]:font-bold",
  "[&_h2:not([class])]:text-xl [&_h2:not([class])]:sm:text-2xl [&_h2:not([class])]:font-normal [&_h2:not([class])]:text-white [&_h2:not([class])]:pt-4",
  "[&_h3:not([class])]:text-sm [&_h3:not([class])]:sm:text-base [&_h3:not([class])]:font-bold [&_h3:not([class])]:text-white [&_h3:not([class])]:pt-2",
  "[&_h4:not([class])]:text-sm [&_h4:not([class])]:font-bold [&_h4:not([class])]:text-white",
  "[&_ul:not([class])]:space-y-2 [&_ul:not([class])]:pl-5 [&_ul:not([class])]:list-disc [&_ul:not([class])]:marker:text-[#8B5CF6]",
  "[&_ol:not([class])]:space-y-2 [&_ol:not([class])]:pl-5 [&_ol:not([class])]:list-decimal [&_ol:not([class])]:marker:text-[#8B5CF6]",
  "[&_a:not([class])]:text-[#A855F7] [&_a:not([class])]:underline hover:[&_a:not([class])]:text-white",
  "[&_blockquote:not([class])]:italic [&_blockquote:not([class])]:border-l-2 [&_blockquote:not([class])]:border-[#7C3AED] [&_blockquote:not([class])]:pl-4",
  "[&_img:not([class])]:rounded-2xl [&_img:not([class])]:max-w-full [&_img:not([class])]:h-auto [&_img:not([class])]:border [&_img:not([class])]:border-white/10 [&_img:not([class])]:my-4",
].join(" ");

export function ProductDetailsHero({ product }: { product: ProductPost }) {
  const image = product.featuredImage || product.image;

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] flex items-center justify-center -mt-[96px] sm:-mt-[104px] pt-[130px] sm:pt-[150px] pb-12 px-6 sm:px-10 bg-[#050505] text-white overflow-hidden z-0">
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[500px] pointer-events-none z-0 opacity-70"
        style={{
          background: "radial-gradient(circle at bottom left, rgba(124, 58, 237, 0.35) 0%, rgba(35, 14, 60, 0.1) 50%, transparent 75%)",
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        <div className="flex-1 flex flex-col justify-center space-y-6 w-full">
          <div className="space-y-4">
            {product.logo && (
              <div className="relative w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 overflow-hidden">
                <CaseStudyImage src={product.logo} alt={`${product.name} logo`} sizes="64px" className="object-contain p-2" />
              </div>
            )}

            <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-normal text-white leading-[1.12] tracking-tight max-w-2xl" style={DURU}>
              {product.name}
            </h1>

            {product.subtitle && (
              <div className="text-[11px] sm:text-xs tracking-[0.2em] font-extrabold uppercase text-[#C2BDCF] opacity-90 pt-1" style={MONO}>
                {product.subtitle}
              </div>
            )}

            {product.shortDescription && (
              <p className="text-xs sm:text-[13.5px] text-[#8E8A9F] leading-relaxed font-light max-w-xl pt-2" style={MONO}>
                {product.shortDescription}
              </p>
            )}
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            {product.websiteUrl && (
              <a
                href={product.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-6 pl-7 pr-2 py-2 rounded-[20px] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/35 hover:border-[#7C3AED]/50 transition-all duration-300 text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white group/btn shadow-[0_0_25px_rgba(124,58,237,0.15)] hover:shadow-[0_0_35px_rgba(124,58,237,0.25)]"
                style={MONO}
              >
                <span>Visit Website<span className="sr-only"> (opens in a new tab)</span></span>
                <div className="w-[50px] h-[36px] sm:w-[56px] sm:h-[40px] rounded-tl-[16px] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[4px] bg-white text-[#7C3AED] flex items-center justify-center shadow-lg group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                  <ExternalLink className="w-5 h-5 stroke-[2] text-[#7C3AED]" aria-hidden="true" />
                </div>
              </a>
            )}
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[18px] border border-white/15 hover:border-white/30 text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white/80 hover:text-white transition-colors"
              style={MONO}
            >
              Talk to us <MoveRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {image && (
          <div className="w-full lg:w-[540px] xl:w-[580px] h-[300px] sm:h-[380px] lg:h-[400px] rounded-[24px] overflow-hidden shrink-0 relative border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.65)] bg-white/[0.02]">
            <CaseStudyImage
              src={image}
              alt={product.featuredImageAlt || product.name}
              priority
              sizes="(max-width: 1024px) 100vw, 580px"
              className="object-contain object-center"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl sm:text-3xl font-normal text-white mb-6" style={DURU}>
      {children}
    </h2>
  );
}

export function ProductDetailsContent({ product, others }: { product: ProductPost; others: ProductPost[] }) {
  const gallery = product.gallery ?? [];

  return (
    <section className="w-full bg-[#050505] text-white py-14 sm:py-20 px-6 sm:px-10 relative z-10">
      <div className="max-w-[1100px] mx-auto space-y-16">
        {product.contentHtml && (
          <div aria-labelledby="product-overview">
            <SectionTitle id="product-overview">Overview</SectionTitle>
            <div className={RICH_TEXT} style={MONO} dangerouslySetInnerHTML={{ __html: product.contentHtml }} />
          </div>
        )}

        {product.features.length > 0 && (
          <div aria-labelledby="product-features">
            <SectionTitle id="product-features">Key Features &amp; Benefits</SectionTitle>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 p-5 rounded-2xl bg-[#07070C] border border-white/10">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#A855F7]" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-white/80 leading-relaxed" style={MONO}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {gallery.length > 0 && (
          <div aria-labelledby="product-gallery">
            <SectionTitle id="product-gallery">Product Gallery</SectionTitle>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((img) => (
                <li key={img.url} className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[#07070C]">
                  <CaseStudyImage src={img.url} alt={img.alt} sizes="(max-width: 640px) 100vw, 550px" className="object-cover object-center" />
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.technologies.length > 0 && (
          <div aria-labelledby="product-tech">
            <SectionTitle id="product-tech">Technologies Used</SectionTitle>
            <ul className="flex flex-wrap gap-2.5">
              {product.technologies.map((tech) => (
                <li
                  key={tech}
                  className="px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.12em] uppercase text-white/80 border border-white/20 bg-white/[0.03]"
                  style={MONO}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.websiteUrl && (
          <div className="rounded-3xl border border-[#7C3AED]/30 bg-[#7C3AED]/[0.06] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl text-white" style={DURU}>Explore {product.name}</h2>
              <p className="text-xs sm:text-sm text-white/60 mt-2" style={MONO}>Visit the official website to learn more, see pricing and get started.</p>
            </div>
            <a
              href={product.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-white text-[#7C3AED] text-xs sm:text-[13px] font-bold tracking-[0.12em] uppercase shrink-0 hover:opacity-90"
              style={MONO}
            >
              Visit Website <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        )}

        {others.length > 0 && (
          <div aria-labelledby="product-more">
            <SectionTitle id="product-more">More Products</SectionTitle>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {others.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/products/${o.slug}`}
                    className="block h-full p-5 rounded-2xl bg-[#07070C] border border-white/10 hover:border-white/30 transition-colors"
                  >
                    <p className="text-lg text-white" style={DURU}>{o.name}</p>
                    {o.subtitle && <p className="text-[11px] text-[#A855F7] mt-1" style={MONO}>{o.subtitle}</p>}
                    {o.shortDescription && <p className="text-xs text-white/50 mt-3 line-clamp-3" style={MONO}>{o.shortDescription}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
