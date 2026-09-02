"use client";

import React from "react";
import CommonServiceHero from "@/components/common/CommonServiceHero";

function CustomDevHero() {
  return (
    <CommonServiceHero
      eyebrow="CUSTOM DEVELOPMENT"
      eyebrowColor="#9CA3AF"
      title={
        <>
          Software Built Around{" "}
          <span className="block font-normal bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
            Your Business
          </span>
        </>
      }
      description="We design and develop custom software that fits your workflows, connects your systems, and scales with your business—from web and mobile applications to enterprise platforms and intelligent solutions."
      primaryCta={{
        text: "Start Your Project",
        href: "/contact-us",
      }}
      secondaryCta={{
        text: "Talk to an Expert",
        href: "/contact-us",
      }}

      sectionAriaLabel="Custom Development Hero Section"
    />
  );
}

export default CustomDevHero;


