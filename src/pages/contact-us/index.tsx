import Head from "next/head";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import ContactHero from "@/components/contact/ContactHero";
import TrustedClients from "@/components/common/TrustedClients";
import FAQSection from "@/components/home/FAQSection";
import RankedSection from "@/components/common/RankedSection";
import ContactCTA from "@/components/home/CTA";
import FloatingButtons from "@/components/common/FloatingButtons";
import Footer from "@/components/common/Footer";

export default function ContactUsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us - CloudCentric",
    "url": "https://cloudcentric.com/contact-us",
    "description": "Let's build something intelligent together. Contact CloudCentric for AI, Salesforce, enterprise software, and cloud solutions."
  };

  return (
    <>
      <Head>
        <title>Contact Us - CloudCentric</title>
        <meta
          name="description"
          content="Let's build something intelligent together. Contact CloudCentric for AI, Salesforce, enterprise software, and cloud solutions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cloudcentric.com/contact-us" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Us - CloudCentric" />
        <meta property="og:description" content="Let's build something intelligent together. Contact CloudCentric for AI, Salesforce, and cloud solutions." />
        <meta property="og:url" content="https://cloudcentric.com/contact-us" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us - CloudCentric" />
        <meta name="twitter:description" content="Let's build something intelligent together. Contact CloudCentric." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <ContactHero />
          <TrustedClients />
          <FAQSection />
          <RankedSection />
          <ContactCTA />

          <FloatingButtons />
        </div>
        <Footer />
      </main>
    </>
  );
}
