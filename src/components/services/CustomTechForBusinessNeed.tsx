"use client";

import React from "react";
import { Globe, Smartphone, Building2, Layers, Network, Sparkles } from "lucide-react";
import CommonTechGridSection, { TechGridCardItem } from "@/components/common/CommonTechGridSection";

export type CustomTechCardItem = TechGridCardItem;

export const customTechCardsData: CustomTechCardItem[] = [
  {
    id: "custom-web-apps",
    icon: Globe,
    iconColor: "#A855F7",
    title: "Custom Web Applications",
    description: "Build secure, scalable web applications designed around your unique workflows and user needs.",
    linkText: "Explore Web Development",
    href: "/contact-us",
  },
  {
    id: "mobile-apps",
    icon: Smartphone,
    iconColor: "#A855F7",
    title: "Mobile Applications",
    description: "Create intuitive iOS and Android experiences that connect customers, employees, and business operations.",
    linkText: "Explore App Development",
    href: "/contact-us",
  },
  {
    id: "enterprise-software",
    icon: Building2,
    iconColor: "#A855F7",
    title: "Enterprise Software",
    description: "Modernize complex business processes with scalable applications built for enterprise environments.",
    linkText: "Explore Enterprise Development",
    href: "/contact-us",
  },
  {
    id: "saas-digital-products",
    icon: Layers,
    iconColor: "#A855F7",
    title: "SaaS & Digital Products",
    description: "Turn your product idea into a scalable SaaS platform with the architecture, features, and experience needed for growth.",
    linkText: "Build Your Product",
    href: "/contact-us",
  },
  {
    id: "api-system-integration",
    icon: Network,
    iconColor: "#A855F7",
    title: "API & System Integration",
    description: "Connect applications, platforms, databases, and third-party services to create a unified technology ecosystem.",
    linkText: "Explore Integrations",
    href: "/contact-us",
  },
  {
    id: "ai-powered-apps",
    icon: Sparkles,
    iconColor: "#A855F7",
    title: "AI-Powered Applications",
    description: "Bring intelligence into your software with AI agents, Generative AI, automation, analytics, and intelligent workflows.",
    linkText: "Explore AI Solutions",
    href: "/service/ai-solutions",
  },
];

function CustomTechForBusinessNeed() {
  return (
    <CommonTechGridSection
      eyebrow="/ WHAT WE DO"
      eyebrowColor="#9CA3AF"
      title={
        <>
          Custom Technology for Every<br className="hidden sm:inline" /> Business Need
        </>
      }
      subtitle="From a focused business application to a complete digital platform, our engineering teams build solutions around your goals, users, and processes."
      cardsData={customTechCardsData}
      sectionId="solutions"
      ariaLabel="Custom Technology for Every Business Need"
      iconShape="circle"
      linkIcon="right"
    />
  );
}

export default CustomTechForBusinessNeed;


