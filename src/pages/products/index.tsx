import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import RankedSection from "@/components/common/RankedSection";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import ProductCard, { ProductSection } from "@/components/products/ProductCard";
import ProductsHero from "@/components/products/ProductsHero";

const PRODUCTS: ProductSection[] = [
  {
    id: "fieldblaze",
    name: "FieldBlaze",
    category: "Field Services",
    titleSuffix: "Field Force Management Software Built on Salesforce",
    description: "Effortlessly manage your field workforce with real-time tracking, order automation, attendance monitoring, and expense tracking. Built on Salesforce, FieldBlaze ensures unmatched security, scalability, and process optimization.",
    bullets: [
      "Real-Time Location Tracking",
      "Inventory & Visit Management",
      "Order & Task Assignment",
      "Attendance & Expense Automation"
    ],
    image: "/images/products/fieldblaze-product-img.png",
    href: "http://fieldblaze.com/",
    accentColor: "#3B82F6", // Blue
    btnText: "Learn More"
  },
  {
    id: "flyblaze",
    name: "FlyBlaze",
    category: "SaaS Platforms",
    titleSuffix: "White-Label Travel Portal for Agencies & Businesses",
    description: "The Ultimate Tech Solution for Your Travel Business. Empower your travel agency with a ready-to-use platform that simplifies flight and hotel bookings, streamlines operations, and increases revenue with real-time availability and secure transactions.",
    bullets: [
      "All-in-One Booking Platform",
      "Seamless API Integrations",
      "Flights & Hotel Inventory Integration",
      "Automated Billing & Payment Gateways"
    ],
    image: "/images/products/flyblaze-product-img.png",
    href: "http://flyblaze.com/",
    accentColor: "#3B82F6", // Blue
    btnText: "Explore FlyBlaze"
  },
  {
    id: "c3messenger",
    name: "C3 Messenger",
    category: "SaaS Platforms",
    titleSuffix: "WhatsApp Marketing & Omnichannel CRM Triggers",
    description: "Multi-channel messaging hub connecting CRM triggers with WhatsApp, SMS, Slack, and email channels instantly. Send notifications, campaign updates, and marketing broadcasts.",
    bullets: [
      "CRM Communication Hub",
      "WhatsApp Marketing Tools",
      "Campaign Broadcasts Engine",
      "Real-time Notification Delivery"
    ],
    image: "/images/products/C3Messenger-–-WhatsApp-Marketing-Tool.png",
    href: "https://messagify.net/",
    accentColor: "#3B82F6", // Blue
    btnText: "Explore C3 Messenger"
  },
  {
    id: "hoopmein",
    name: "Hoopmein",
    category: "SaaS Platforms",
    titleSuffix: "Social Collaboration & Community Events Portal",
    description: "Connect people around team activities, sports matches, and local events. Create matches, track attendance, manage RSVP, and chat with team members in one place.",
    bullets: [
      "Event Scheduling & Invites",
      "RSVP & Roster Controls",
      "Interactive Group Chat",
      "Community Activity Streams"
    ],
    image: "/images/products/hoopmein-product-img.png",
    href: "https://hoopmein.com/",
    accentColor: "#3B82F6", // Blue
    btnText: "Explore Hoopmein"
  },
  {
    id: "c3im",
    name: "C3IM",
    category: "Salesforce Apps",
    titleSuffix: "Salesforce AppExchange Interaction Manager",
    description: "Custom Interaction Integration Manager certified and listed on Salesforce AppExchange. Seamlessly integrates external channels inside Service Cloud console for agent efficiency.",
    bullets: [
      "Certified Salesforce App",
      "Service Cloud Console View",
      "Omnichannel Agent Panel",
      "High Compliance Logging"
    ],
    image: "/images/products/c3im-product-img.png",
    href: "https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000FvKpqUAF",
    accentColor: "#3B82F6", // Blue
    btnText: "Explore C3IM"
  }
];

// Reusable ProductCard is imported from "@/components/products/ProductCard"

export default function ProductsPage() {
  const jsonLd = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" }
  ]);

  return (
    <>
      <SEOHead
        title="Our Products - CloudCentric | Custom Salesforce Apps & SaaS Tools"
        description="Explore our suite of next-generation Salesforce-powered applications, cloud automation tools, and custom-built enterprise SaaS platforms."
        canonical={`${SITE_URL}/products`}
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <ProductsHero />

          {/* ── Product List Cards Section (Matching Case Study Card UI) ── */}
          <section className="w-full bg-[#050505] text-white py-16 sm:py-24 px-6 sm:px-10 lg:px-16 z-10 relative">
            <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
              {PRODUCTS.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>

          <RankedSection />
          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
