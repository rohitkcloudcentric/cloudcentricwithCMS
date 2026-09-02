"use client";

import React from "react";
import CommonServiceHero from "@/components/common/CommonServiceHero";

function GrowthDigitalHero() {
  return (
    <CommonServiceHero
      eyebrow="GROWTH & DIGITAL EXPERIENCE"
      eyebrowColor="#38BDF8"
      title={
        <>
          Build Experiences That Get<br />
          <span className="bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
            Seen, Chosen & Remembered
          </span>
        </>
      }
      tagline="Strategy. Experience. Growth."
      description="We combine brand, design, digital experience, and performance marketing to help businesses attract the right audience, create meaningful experiences, and turn attention into growth."
      primaryCta={{
        text: "Start Your Project",
        href: "/contact-us",
        ariaLabel: "Start Your Project - Contact CloudCentric",
      }}
      secondaryCta={{
        text: "Talk to a Growth Expert",
        href: "/contact-us",
        ariaLabel: "Talk to a Growth Expert",
      }}
      showcaseImage={{
        src: "/images/services/salesforce-landing-page_hero-image-1-1.png",
        alt: "Growth & Digital Experience Platform Showcase",
        width: 800,
        height: 600,
      }}
      bullets={[
        { title: "Strategy + Creative", subtitle: "Built Around Your Business", dotColor: "#E11D48" },
        { title: "Digital Experience", subtitle: "Designed For People", dotColor: "#818CF8" },
        { title: "Performance", subtitle: "Focused on Growth", dotColor: "#C084FC" },
      ]}
      sectionAriaLabel="Growth & Digital Experience Services Hero Section"
      minHeightClass="min-h-[600px] sm:min-h-[660px] lg:min-h-[720px]"
    />
  );
}

export default GrowthDigitalHero;


