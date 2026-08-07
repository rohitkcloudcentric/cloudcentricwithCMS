import Head from "next/head";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import OurClientsHero from "@/components/OurClientsHero";
import TrustedClients from "@/components/TrustedClients";
import FAQSection from "@/components/FAQSection";
import RankedSection from "@/components/RankedSection";
import WhoWeAreCTA from "@/components/CTA";

export default function OurClients() {
  return (
    <>
      <Head>
        <title>Our Clients - CloudCentric</title>
        <meta
          name="description"
          content="Discover the global brands and enterprises that trust CloudCentric to power their digital transformation."
        />
      </Head>
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <OurClientsHero />
          <TrustedClients />
          <FAQSection />
          <RankedSection />
          <WhoWeAreCTA />

          <FloatingButtons />
        </div>
        <Footer />
      </main>
    </>
  );
}
