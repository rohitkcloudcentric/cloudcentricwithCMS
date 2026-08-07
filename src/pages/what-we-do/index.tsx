import Head from "next/head";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import WhatWeDoHero from "@/components/WhatWeDoHero";
import OurAICapabilities from "@/components/OurAICapabilities";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";

export default function WhatWeDo() {
  return (
    <>
      <Head>
        <title>What We Do - CloudCentric</title>
        <meta
          name="description"
          content="Intelligent Technology Solutions for Modern Businesses. We help organizations harness the power of AI, Salesforce, enterprise software, and cloud technologies."
        />
      </Head>
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <WhatWeDoHero />
          <OurAICapabilities />

          <FloatingButtons />
        </div>
        <Footer />
      </main>
    </>
  );
}
