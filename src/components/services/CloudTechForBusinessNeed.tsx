"use client";

import React from "react";
import { Compass, RotateCw, Cpu, Link as LinkIcon, Terminal, ShieldCheck } from "lucide-react";
import CommonTechGridSection, { TechGridCardItem } from "@/components/common/CommonTechGridSection";

export type CloudTechCardItem = TechGridCardItem;

export interface CloudTechForBusinessNeedProps {
  eyebrow?: string;
  title?: string | React.ReactNode;
  subtitle?: string;
  cardsData?: CloudTechCardItem[];
}

export const defaultCloudTechCardsData: CloudTechCardItem[] = [
  {
    id: "cloud-strategy-consulting",
    icon: Compass,
    iconColor: "#60A5FA",
    title: "Cloud Strategy & Consulting",
    description: "Define the right cloud architecture, migration strategy, and technology roadmap for your business.",
    linkText: "Cloud Assessment · Architecture · Roadmaps",
    href: "/contact-us",
  },
  {
    id: "cloud-migration",
    icon: RotateCw,
    iconColor: "#A78BFA",
    title: "Cloud Migration",
    description: "Move applications, workloads, and data to the cloud with a structured approach designed to minimize disruption.",
    linkText: "Migration · Modernization · Optimization",
    href: "/contact-us",
  },
  {
    id: "cloud-app-development",
    icon: Cpu,
    iconColor: "#38BDF8",
    title: "Cloud Application Development",
    description: "Build scalable, secure, cloud-native applications designed for performance and flexibility.",
    linkText: "Cloud-Native · Microservices · Serverless",
    href: "/contact-us",
  },
  {
    id: "api-system-integration",
    icon: LinkIcon,
    iconColor: "#C084FC",
    title: "API & System Integration",
    description: "Connect your applications, platforms, databases, and third-party services through reliable integrations.",
    linkText: "REST APIs · Third-Party APIs · Middleware",
    href: "/contact-us",
  },
  {
    id: "devops-automation",
    icon: Terminal,
    iconColor: "#818CF8",
    title: "DevOps & Automation",
    description: "Automate development and deployment processes to release faster, improve reliability, and reduce operational effort.",
    linkText: "CI/CD · Infrastructure Automation · Monitoring",
    href: "/contact-us",
  },
  {
    id: "cloud-security-optimization",
    icon: ShieldCheck,
    iconColor: "#34D399",
    title: "Cloud Security & Optimization",
    description: "Improve security, reliability, performance, and cloud efficiency across your technology environment.",
    linkText: "Security · Monitoring · Cost Optimization",
    href: "/contact-us",
  },
];

function CloudTechForBusinessNeed({
  eyebrow = "/ WHAT WE DO",
  title = (
    <>
      Build a Connected, Cloud-<br className="hidden sm:inline" />Ready Business
    </>
  ),
  subtitle = "From cloud migration to API integration and DevOps automation, we create the technology foundation your business needs to operate and scale.",
  cardsData = defaultCloudTechCardsData,
}: CloudTechForBusinessNeedProps) {
  return (
    <CommonTechGridSection
      eyebrow={eyebrow}
      eyebrowColor="#A78BFA"
      title={title}
      subtitle={subtitle}
      cardsData={cardsData}
      sectionId="solutions"
      ariaLabel="Cloud & Integration Solutions Grid"
    />
  );
}

export default CloudTechForBusinessNeed;


