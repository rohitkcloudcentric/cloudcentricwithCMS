"use client";

import Image from "next/image";

export default function HeroCard() {
  return (
    <div className="w-full rounded-[24px] bg-[rgba(15,15,20,0.45)] backdrop-blur-[24px] border border-white/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center space-x-5 hover:border-[#7C3AED]/40 transition-all duration-300 group">
      {/* Left Rounded Image / Visor Graphic */}
      <div className="relative w-[130px] h-[145px] rounded-2xl overflow-hidden shrink-0 border border-white/10 flex items-center justify-center bg-black/20">
        <Image
          src="/images/build-the-right.png"
          alt="AI Robot Assistant"
          width={130}
          height={145}
          className="object-cover w-full h-full transform group-hover:scale-[1.03] transition-transform duration-500"
          priority
        />
      </div>

      {/* Right Content */}
      <div className="flex flex-col justify-between space-y-4 py-1">
        <div className="space-y-1.5">
          <h3 
            className="text-base md:text-lg font-normal text-white leading-snug tracking-tight"
            style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
          >
            Build the Right AI Strategy Before You Build AI
          </h3>
          <p 
            className="text-[11px] text-[#C6C6D1] leading-relaxed font-light"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            Identify the highest-impact AI opportunities for your business with a clear roadmap tailored to your goals.
          </p>
        </div>
        <div>
          <button 
            className="px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-[11px] font-semibold hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-95"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            Start Your AI Journey
          </button>
        </div>
      </div>
    </div>
  );
}
