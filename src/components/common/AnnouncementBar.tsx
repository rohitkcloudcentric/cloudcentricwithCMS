"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="hidden sm:flex relative z-40 h-[30px] w-full bg-[rgba(10,10,12,0.4)] backdrop-blur-sm items-center justify-between px-4 text-xs font-normal text-white">
      <div className="flex-1 flex items-center justify-center space-x-1.5" style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}>
        <span className="text-white/90 text-xs">
          Ready to Transform Your Business with AI &amp; Intelligent Automation?
        </span>
        <a
          href="#contact"
          className="inline-flex items-center text-xs text-white/90 hover:text-purple-400 font-medium transition-colors ml-1 group"
        >
          <span>Let&apos;s Talk</span>
          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white/60 hover:text-white transition-colors"
        aria-label="Close Announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
