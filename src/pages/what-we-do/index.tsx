import Head from "next/head";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import WhatWeDoHero from "@/components/WhatWeDoHero";
import OurAICapabilities from "@/components/OurAICapabilities";
import CoreCapabilities from "@/components/CoreCapabilities";
import RankedSection from "@/components/RankedSection";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";

export default function WhatWeDo() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Intelligent Technology Solutions & AI Services",
    "provider": {
      "@type": "Organization",
      "name": "CloudCentric",
      "url": "https://cloudcentric.com"
    },
    "description": "Intelligent Technology Solutions for Modern Businesses. AI strategy, automation, custom AI development, Salesforce ecosystem, and enterprise software."
  };

  return (
    <>
      <Head>
        <title>What We Do - CloudCentric</title>
        <meta
          name="description"
          content="Intelligent Technology Solutions for Modern Businesses. We help organizations harness the power of AI, Salesforce, enterprise software, and cloud technologies."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cloudcentric.com/what-we-do" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="What We Do - CloudCentric" />
        <meta property="og:description" content="Intelligent Technology Solutions for Modern Businesses. AI, Salesforce, and cloud software." />
        <meta property="og:url" content="https://cloudcentric.com/what-we-do" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="What We Do - CloudCentric" />
        <meta name="twitter:description" content="Intelligent Technology Solutions for Modern Businesses." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
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
