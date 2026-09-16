"use client";

import React from "react";
import { Palette, Layout, Globe, Search, Share2, Target } from "lucide-react";
import CommonTechGridSection, { TechGridCardItem } from "@/components/common/CommonTechGridSection";

export type GrowthTechCardItem = TechGridCardItem;

export interface GrowthTechForBusinessNeedProps {
  eyebrow?: string;
  title?: string | React.ReactNode;
  subtitle?: string;
  cardsData?: GrowthTechCardItem[];
}

export const defaultGrowthTechCardsData: GrowthTechCardItem[] = [
  {
    id: "branding-identity",
    icon: Palette,
    iconColor: "#F43F5E",
    title: "Branding & Identity",
    description: "Build a distinctive brand that communicates who you are and creates consistency across every touchpoint.",
    linkText: "Brand Strategy · Visual Identity · Brand Guidelines",
    href: "/contact-us",
  },
  {
    id: "ui-ux-design",
    icon: Layout,
    iconColor: "#A78BFA",
    title: "UI/UX Design",
    description: "Create intuitive, engaging digital experiences that make complex products simple and enjoyable to use.",
    linkText: "UX Strategy · UI Design · Product Design",
    href: "/contact-us",
  },
  {
    id: "web-experience",
    icon: Globe,
    iconColor: "#38BDF8",
    title: "Web Experience",
    description: "Design and build high-performing websites that communicate your value and turn visitors into customers.",
    linkText: "Web Design · Landing Pages · Conversion",
    href: "/contact-us",
  },
  {
    id: "seo",
    icon: Search,
    iconColor: "#34D399",
    title: "SEO",
    description: "Improve your visibility in search and attract high-intent audiences through sustainable organic growth.",
    linkText: "Technical SEO · Content · Local SEO",
    href: "/contact-us",
  },
  {
    id: "social-media-content",
    icon: Share2,
    iconColor: "#F97316",
    title: "Social Media & Content",
    description: "Build meaningful digital presence with content and social strategies designed around your audience.",
    linkText: "Social Media · Content Strategy · Creative",
    href: "/contact-us",
  },
  {
    id: "performance-marketing",
    icon: Target,
    iconColor: "#0284C7",
    title: "Performance Marketing",
    description: "Reach the right audience with targeted campaigns designed to generate leads, conversions, and measurable returns.",
    linkText: "Google Ads · Meta Ads · Campaign Optimization",
    href: "/contact-us",
  },
];

function GrowthTechForBusinessNeed({
  eyebrow = "/ WHAT WE DO",
  title = (
    <>
      Everything Your Digital Presence<br className="hidden sm:inline" /> Needs to Grow
    </>
  ),
  subtitle = "From brand identity and user experience to search, social, and paid acquisition—we bring the key pieces of digital growth together.",
  cardsData = defaultGrowthTechCardsData,
}: GrowthTechForBusinessNeedProps) {
  return (
    <CommonTechGridSection
      eyebrow={eyebrow}
      eyebrowColor="#A78BFA"
      title={title}
      subtitle={subtitle}
      cardsData={cardsData}
      sectionId="solutions"
      ariaLabel="Growth & Digital Experience Services Grid"
    />
  );
}

export default GrowthTechForBusinessNeed;


