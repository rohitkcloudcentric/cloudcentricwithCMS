import Head from "next/head";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import BuildingIntelligent from "@/components/home/BuildingIntelligent";
import HowWeBuild from "@/components/home/HowWeBuild";
import AIEcosystem from "@/components/home/AIEcosystem";
import TrustedClients from "@/components/common/TrustedClients";
import RankedSection from "@/components/common/RankedSection";
import ContactUs from "@/components/contact/ContactUs";
import FloatingButtons from "@/components/common/FloatingButtons";
import Footer from "@/components/common/Footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CloudCentric",
    "url": "https://cloudcentric.com",
    "logo": "https://cloudcentric.com/logo.png",
    "description": "Where Artificial Intelligence meets business innovation. We build scalable AI solutions, Salesforce platforms, enterprise software, and digital cloud experiences.",
    "sameAs": [
      "https://www.youtube.com/channel/UC21Gs_6xh8PF1nc8-XIyHJg",
      "https://www.instagram.com/cccinfotech/",
      "https://x.com/CCCInfotech",
      "https://www.linkedin.com/company/cccinfotech/",
      "https://www.facebook.com/cloudcentricinfotech/"
    ]
  };

  return (
    <>
      <Head>
        <title>CloudCentric - Where Artificial Intelligence Meets Business Innovation</title>
        <meta
          name="description"
          content="CloudCentric helps modern businesses adopt AI, automate workflows, optimize customer experiences, and build scalable digital ecosystems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cloudcentric.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CloudCentric - Where Artificial Intelligence Meets Business Innovation" />
        <meta property="og:description" content="We help modern businesses adopt AI, automate workflows, optimize customer experiences, and build scalable digital ecosystems." />
        <meta property="og:url" content="https://cloudcentric.com" />
        <meta property="og:site_name" content="CloudCentric" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CloudCentric - Where Artificial Intelligence Meets Business Innovation" />
        <meta name="twitter:description" content="We help modern businesses adopt AI, automate workflows, optimize customer experiences, and build scalable digital ecosystems." />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        {/* Background Radial Glow Layer */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1000px] pointer-events-none z-0"
          style={{
            backgroundImage: "url('/images/hero-bg-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        {/* Background Ribbon Flow Layer */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1000px] pointer-events-none z-0 mix-blend-screen opacity-85"
          style={{
            backgroundImage: "url('/images/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "invert(1) hue-rotate(180deg) brightness(1.25) contrast(1.2)",
          }}
        />

        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />
          <Hero />
          <BuildingIntelligent />
          <HowWeBuild />
          <AIEcosystem />
          <TrustedClients />
          <RankedSection />

          <section id="contact">
            <ContactUs />
          </section>
        <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
