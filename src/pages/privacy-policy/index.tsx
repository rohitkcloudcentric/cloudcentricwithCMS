import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import PrivacyPolicyContent from "@/components/privacy-policy/PrivacyPolicyContent";

export default function PrivacyPolicyPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy - CloudCentric",
      "url": `${SITE_URL}/privacy-policy`,
      "description": "Read the Privacy Policy and Legal Terms of Service for CloudCentric Infotech."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Privacy Policy", url: "/privacy-policy" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Privacy Policy - CloudCentric"
        description="Read the Privacy Policy and Legal Terms of Service for CloudCentric Infotech."
        canonical={`${SITE_URL}/privacy-policy`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full min-h-screen justify-between">
          {/* Header */}
          <AnnouncementBar />
          <Navbar />

          {/* Privacy Policy Content */}
          <PrivacyPolicyContent />

          {/* Footer */}
          <Footer />
        </div>

        <FloatingButtons />
      </main>
    </>
  );
}
