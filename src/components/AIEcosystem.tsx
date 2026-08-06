"use client";

import Image from "next/image";

export default function AIEcosystem() {
  return (
    <section className="w-full bg-[#050505] py-24 px-4 overflow-hidden text-white">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-4">

        {/* Label */}
        <p
          className="text-sm font-bold tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-intel-one-mono), monospace",
            background: "linear-gradient(90deg, #2F89FF 0%, #B021F0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          AI Ecosystem
        </p>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl md:text-4xl font-normal text-white leading-snug max-w-5xl"
          style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
        >
          Build Smarter Businesses Through Connected AI Connected to Everything.
        </h2>

        {/* CTA Button */}
        <button
          className="mt-2 px-8 py-3 rounded-xl text-white text-[11px] font-semibold tracking-[0.18em] uppercase transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95"
          style={{
            fontFamily: "var(--font-intel-one-mono), monospace",
            background: "linear-gradient(90deg, #2F89FF 0%, #B021F0 100%)",
            boxShadow: "0 0 28px rgba(47, 137, 255, 0.4)",
          }}
        >
          Explore AI Solutions
        </button>

        {/* Ecosystem Network Diagram — using actual image */}
        <div className="relative w-full max-w-4xl mt-6">
          <Image
            src="/images/build-smarter-1.png"
            alt="AI Ecosystem - Connected integrations diagram"
            width={1400}
            height={780}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

      </div>
    </section>
  );
}
