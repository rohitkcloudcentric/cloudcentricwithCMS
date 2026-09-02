"use client";

import React from "react";
import CommonServiceHero from "@/components/common/CommonServiceHero";

function CloudIntegrationHero() {
  return (
    <CommonServiceHero
      eyebrow="CLOUD & INTEGRATION"
      eyebrowColor="#38BDF8"
      title={
        <>
          Connect. Modernize.<br />
          <span className="bg-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#C084FC] bg-clip-text text-transparent">
            Scale With Confidence.
          </span>
        </>
      }
      tagline="Cloud Infrastructure & Integrations Built for the Modern Enterprise"
      description="We help businesses modernize their infrastructure, connect critical systems, and build secure, scalable cloud environments using AWS, Azure, APIs, DevOps, and modern integration technologies."
      primaryCta={{
        text: "Talk to a Cloud Expert",
        href: "/contact-us",
        ariaLabel: "Talk to a Cloud Expert - Contact CloudCentric",
      }}
      secondaryCta={{
        text: "Explore Solutions",
        href: "#solutions",
        ariaLabel: "Explore Cloud & Integration Solutions",
      }}
      showcaseImage={{
        src: "/images/services/salesforce-landing-page_hero-image-1-1.png",
        alt: "Cloud & Integration Services Platform Showcase",
        width: 800,
        height: 600,
      }}
      bullets={[
        { title: "Cloud Expertise", subtitle: "AWS • Azure • Cloud Platforms", dotColor: "#38BDF8" },
        { title: "Connected Systems", subtitle: "APIs • Integrations • Data", dotColor: "#38BDF8" },
        { title: "Built to Scale", subtitle: "Secure • Reliable • Automated", dotColor: "#38BDF8" },
      ]}
      sectionAriaLabel="Cloud & Integration Services Hero Section"
      minHeightClass="min-h-[600px] sm:min-h-[660px] lg:min-h-[720px]"
    />
  );
}

export default CloudIntegrationHero;


