import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import WhatWeDoHero from "@/components/home/WhatWeDoHero";
import OurAICapabilities from "@/components/home/OurAICapabilities";
import CoreCapabilities from "@/components/home/CoreCapabilities";
import RankedSection from "@/components/common/RankedSection";
import FloatingButtons from "@/components/common/FloatingButtons";
import Footer from "@/components/common/Footer";

export default function WhatWeDo() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Intelligent Technology Solutions & AI Services",
      "provider": {
        "@type": "Organization",
        "name": "CloudCentric",
        "url": SITE_URL
      },
      "description": "Intelligent Technology Solutions for Modern Businesses. AI strategy, automation, custom AI development, Salesforce ecosystem, and enterprise software."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "What We Do", url: "/what-we-do" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="What We Do - CloudCentric | AI, Salesforce & Software Development Services"
        description="Intelligent Technology Solutions for Modern Businesses. We help organizations harness the power of AI, Salesforce, enterprise software, and cloud technologies."
        canonical={`${SITE_URL}/what-we-do`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <WhatWeDoHero />
          <OurAICapabilities />
          <CoreCapabilities />
          <RankedSection />

          <FloatingButtons />
        </div>
        <Footer />
      </main>
    </>
  );
}
