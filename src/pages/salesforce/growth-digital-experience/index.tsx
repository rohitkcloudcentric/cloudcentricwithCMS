import dynamic from "next/dynamic";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import GrowthDigitalHero from "@/components/services/GrowthDigitalHero";
import Footer from "@/components/common/Footer";

// Below-the-fold components loaded dynamically for Performance optimization (LCP/TBT)
const GrowthTechForBusinessNeed = dynamic(() => import("@/components/services/GrowthTechForBusinessNeed"));
const PerformanceGrowthSection = dynamic(() => import("@/components/services/PerformanceGrowthSection"));
const AIGrowthExperienceSection = dynamic(() => import("@/components/services/AIGrowthExperienceSection"));
const AISolutionsFAQSection = dynamic(() => import("@/components/services/AISolutionsFAQSection"));
const RankedSection = dynamic(() => import("@/components/common/RankedSection"));
const ContactUs = dynamic(() => import("@/components/contact/ContactUs"));

export default function GrowthDigitalExperiencePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Growth & Digital Experience Services",
      "provider": {
        "@type": "Organization",
        "name": "CloudCentric",
        "url": SITE_URL
      },
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Branding, UI/UX & Digital Experience Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Branding & Visual Identity" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI/UX Design & User Research" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web & Digital Product Design" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO & Performance Marketing" } }
        ]
      },
      "description": "Combine brand strategy, UI/UX design, digital product engineering, and performance marketing to create experiences that get seen, chosen, and remembered."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Growth & Digital Experience", url: "/growth-digital-experience" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Growth & Digital Experience Services - CloudCentric"
        description="Build digital experiences that get seen, chosen, and remembered. We integrate branding, UI/UX design, web products, SEO, and performance growth."
        canonical={`${SITE_URL}/growth-digital-experience`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Growth & Digital Experience Hero Section */}
          <GrowthDigitalHero />

          {/* Growth & Digital Experience Solutions Grid Section */}
          <GrowthTechForBusinessNeed
            eyebrow="/ WHAT WE DO"
            title={
              <>
                Everything Your Digital Presence<br className="hidden sm:inline" /> Needs to Grow
              </>
            }
            subtitle="From brand identity and user experience to search, social, and paid acquisition—we bring the key pieces of digital growth together."
          />

          {/* Turn Digital Visibility Into Business Growth Section */}
          <PerformanceGrowthSection />

          {/* Make Your Growth Smarter With AI Section */}
          <AIGrowthExperienceSection />

          {/* FAQ Section */}
          <AISolutionsFAQSection
            title={
              <>
                Questions Before You Start Your <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#2563EB] to-[#A855F7] bg-clip-text text-transparent">
                  Digital Growth?
                </span>
              </>
            }
            description="Everything you need to know about our branding, design, UI/UX, SEO, performance marketing, and digital growth services."
            faqs={[
              {
                id: 1,
                question: "01. What digital experience services do you provide?",
                answer:
                  "We offer end-to-end digital experience solutions including visual branding, UI/UX design, web engineering, SEO, content strategy, and performance marketing.",
              },
              {
                id: 2,
                question: "02. Can you redesign our existing website or product?",
                answer:
                  "Yes. We can audit the current experience, identify usability and conversion opportunities, and redesign it around your users and business goals.",
              },
              {
                id: 3,
                question: "03. Do you provide both design and development?",
                answer:
                  "Yes. Our multidisciplinary team manages both creative design (brand, UI/UX) and technical frontend/backend development for a seamless build.",
              },
              {
                id: 4,
                question: "04. Can you manage SEO and paid marketing together?",
                answer:
                  "Yes. We align organic SEO and paid search/social advertising to create an integrated growth strategy that drives both immediate and long-term results.",
              },
              {
                id: 5,
                question: "05. How do you measure digital growth?",
                answer:
                  "We track key business metrics such as conversion rates, organic search traffic, cost per acquisition (CPA), engagement rates, and ROI.",
              },
            ]}
          />


          {/* Ranked Section */}
          <RankedSection />

          {/* Contact Section */}
          <ContactUs />
        </div>
        <Footer />
      </main>
    </>
  );
}
