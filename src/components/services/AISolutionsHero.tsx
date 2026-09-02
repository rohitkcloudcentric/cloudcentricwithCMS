"use client";

import React from "react";
import CommonServiceHero from "@/components/common/CommonServiceHero";

function AISolutionsHero() {
  return (
    <CommonServiceHero
      eyebrow="AI SOLUTIONS"
      eyebrowColor="#9CA3AF"
      title={
        <>
          Turn AI Potential Into{" "}
          <span className="block font-normal bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
            Business Impact
          </span>
        </>
      }
      description={
        <div className="flex flex-col space-y-4 text-[#D1D5DB]">
          <p>
            Build intelligent systems that automate work, empower teams, improve customer experiences, and unlock new opportunities for growth.
          </p>
          <p>
            From AI strategy and agents to generative AI and intelligent automation, CloudCentric helps businesses move from AI experimentation to practical, scalable solutions.
          </p>
        </div>
      }
      primaryCta={{
        text: "Talk to an AI Expert",
        href: "/contact-us",
      }}
      secondaryCta={{
        text: "Explore AI Capabilities",
        href: "#ai-capabilities",
      }}
      showcaseImage={{
        src: "/images/services/salesforce-landing-page_hero-image-1-1.png",
        alt: "AI Solutions & Salesforce Platform Showcase",
        width: 800,
        height: 600,
      }}
      bullets={[
        "10+ Years Technology Experience",
        "400+ Projects Delivered",
        "AI-First Innovation",
        "Enterprise-Ready Solutions",
      ]}
      sectionAriaLabel="AI Solutions Hero Section"
    />
  );
}

export default AISolutionsHero;


