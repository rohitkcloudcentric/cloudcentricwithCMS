import Head from "next/head";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import PrivacyPolicyContent from "@/components/privacy-policy/PrivacyPolicyContent";

export default function PrivacyPolicyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - CloudCentric",
    "url": "https://cloudcentric.com/privacy-policy",
    "description": "Read the Privacy Policy and Legal Terms of Service for CloudCentric Infotech."
  };

  return (
    <>
      <Head>
        <title>Privacy Policy - CloudCentric</title>
        <meta
          name="description"
          content="Read the Privacy Policy and Legal Terms of Service for CloudCentric Infotech."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cloudcentric.com/privacy-policy" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Privacy Policy - CloudCentric" />
        <meta property="og:description" content="Read the Privacy Policy and Legal Terms of Service for CloudCentric Infotech." />
        <meta property="og:url" content="https://cloudcentric.com/privacy-policy" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy - CloudCentric" />
        <meta name="twitter:description" content="Read the Privacy Policy and Legal Terms of Service for CloudCentric Infotech." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
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
