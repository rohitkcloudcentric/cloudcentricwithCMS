"use client";

import { Globe, Paperclip, ArrowRight } from "lucide-react";

export default function AIChatBar() {
  return (
    <div className="w-[90%] max-w-[650px] h-[56px] rounded-full bg-[rgba(10,10,12,0.85)] backdrop-blur-[24px] border border-white/[0.12] px-4 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(124,58,237,0.25)] hover:border-[#7C3AED]/50 transition-all duration-300">
      {/* Left Quick Icons */}
      <div className="flex items-center space-x-2 text-white/50">
        <button className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors">
          <Globe className="w-4.5 h-4.5" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 hover:text-white transition-colors">
          <Paperclip className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="What would you like AI to automate?"
        className="w-full bg-transparent border-none outline-none text-xs md:text-sm text-white placeholder-white/40 px-3 font-normal"
      />

      {/* Purple Action Button */}
      <button className="w-9 h-9 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4F8BFF] flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.6)] hover:scale-105 active:scale-95 transition-transform">
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
