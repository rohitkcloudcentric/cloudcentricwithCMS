"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MoveRight } from "lucide-react";

export interface ProductSection {
  id: string;
  name: string;
  category: string;
  titleSuffix: string;
  description: string;
  bullets: string[];
  image: string;
  href: string;
  accentColor: string;
  btnText: string;
}

export const PRODUCTS: ProductSection[] = [
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

interface ProductCardProps {
  product: ProductSection;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isEvenCard = index % 2 === 1;

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: `${(index % 3) * 140}ms` }}
      className={`group w-full rounded-[24px] bg-[#07070C] border border-white/[0.1] hover:border-white/[0.25] hover:-translate-y-1.5 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_60px_rgba(0,0,0,0.9)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(124,58,237,0.15)] p-7 sm:p-9 lg:p-11 overflow-hidden relative ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-[0.97]"
      }`}
    >
      {/* Soft Purple Radial Glow (Bottom-Left for Odd cards, Bottom-Right for Even cards) */}
      <div 
        className={`absolute bottom-0 w-[450px] h-[350px] pointer-events-none z-0 opacity-80 ${
          isEvenCard ? "right-0 rounded-br-[24px]" : "left-0 rounded-bl-[24px]"
        }`}
        style={{
          background: isEvenCard
            ? "radial-gradient(circle at bottom right, rgba(88, 38, 133, 0.35) 0%, rgba(35, 14, 60, 0.15) 50%, transparent 75%)"
            : "radial-gradient(circle at bottom left, rgba(88, 38, 133, 0.35) 0%, rgba(35, 14, 60, 0.15) 50%, transparent 75%)",
        }}
      />

      <div className={`relative z-10 flex flex-col items-center justify-between gap-8 lg:gap-12 ${
        isEvenCard ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}>
        {/* Text Details Column */}
        <div className={`flex-1 flex flex-col w-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible 
            ? "opacity-100 translate-x-0" 
            : isEvenCard 
              ? "opacity-0 translate-x-12 sm:translate-x-16" 
              : "opacity-0 -translate-x-12 sm:-translate-x-16"
        }`}>
          {/* Suffix Title */}
          <h2 className="text-2xl sm:text-[32px] lg:text-[35px] font-normal text-white leading-[1.2] font-duru mb-6">
            <span style={{ color: product.accentColor }}>{product.name} : </span>
            {product.titleSuffix}
          </h2>

          {/* Overview Section */}
          <div className="flex flex-col mb-5">
            <span 
              className="text-sm sm:text-[15px] font-medium text-[#C2BDCF] font-intel-one-mono mb-1"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Overview:
            </span>
            <p 
              className="text-xs sm:text-[13px] text-white/50 leading-relaxed font-intel-one-mono max-w-xl"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              {product.description}
            </p>
          </div>

          {/* Key Features Section */}
          <div className="flex flex-col mb-7">
            <span 
              className="text-sm sm:text-[15px] font-medium text-[#C2BDCF] font-intel-one-mono mb-2"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              Key Features:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {product.bullets.map((bullet) => (
                <span
                  key={bullet}
                  className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-white/75 border border-white/20 bg-white/[0.02] font-intel-one-mono"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  {bullet}
                </span>
              ))}
            </div>
          </div>

          {/* Visit Product Button (Case study card style) */}
          <div>
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-5 pl-6 pr-1.5 py-1.5 rounded-[14px] bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 backdrop-blur-md transition-all font-intel-one-mono text-xs sm:text-[13px] tracking-[0.12em] uppercase text-white group/btn shadow-md"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              <span>{product.btnText}</span>
              <div className="w-[50px] h-[36px] sm:w-[56px] sm:h-[40px] rounded-tl-[16px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px] bg-white text-[#3B82F6] flex items-center justify-center shadow-lg group-hover/btn:translate-x-0.5 transition-transform shrink-0">
                <MoveRight className="w-5 h-5 stroke-[2] text-[#3B82F6]" />
              </div>
            </a>
          </div>
        </div>

        {/* Image Graphics Column */}
        <div className={`w-full lg:w-[480px] xl:w-[530px] h-[280px] sm:h-[340px] lg:h-[370px] rounded-[18px] overflow-hidden shrink-0 relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible 
            ? "opacity-100 translate-x-0" 
            : isEvenCard 
              ? "opacity-0 -translate-x-12 sm:-translate-x-16" 
              : "opacity-0 translate-x-12 sm:translate-x-16"
        }`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 530px"
            className="object-contain object-center rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      </div>
    </div>
  );
}
