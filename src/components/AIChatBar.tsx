"use client";

import { useState, useEffect } from "react";
import { Sparkles, Paperclip, ChevronRight } from "lucide-react";

export default function AIChatBar() {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls past 120px, stick it to the bottom of the viewport
      if (window.scrollY > 120) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[650px] h-[54px] rounded-full p-[6px] pl-[8px] flex items-center justify-between border transition-all duration-500 ease-in-out hover:border-white/[0.2] ${
        isFixed 
          ? "bg-[rgba(10,10,12,0.85)] backdrop-blur-[24px] border-[#7C3AED]/45 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(124,58,237,0.35)]" 
          : "bg-[rgba(10,10,12,0.65)] backdrop-blur-[16px] border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(124,58,237,0.15)]"
      }`}
    >
      {/* Left Quick Icons */}
      <div className="flex items-center space-x-1.5">
        <button className="w-8 h-8 rounded-full bg-white/[0.9] text-[#18181b] hover:bg-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/[0.9] text-[#18181b] hover:bg-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer">
          <Paperclip className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="What would you like AI to automate?"
        className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-white placeholder-white px-4 font-[family:var(--font-intel-one-mono)] font-medium"
      />

      {/* Purple Action Button */}
      <button className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(124,58,237,0.55)] hover:scale-105 active:scale-95 transition-transform cursor-pointer">
        <ChevronRight className="w-4 h-4 stroke-[3]" />
      </button>
    </div>
  );
}
