import Head from "next/head";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ContactHero from "@/components/ContactHero";
import TrustedClients from "@/components/TrustedClients";
import FAQSection from "@/components/FAQSection";
import RankedSection from "@/components/RankedSection";
import ContactCTA from "@/components/CTA";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";

export default function ContactUsPage() {
  return (
    <>
      <Head>
        <title>Contact Us - CloudCentric</title>
        <meta
          name="description"
          content="Let's build something intelligent together. Contact CloudCentric for AI, Salesforce, enterprise software, and cloud solutions."
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
