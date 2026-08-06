"use client";

import { MessageSquare, ArrowUp } from "lucide-react";

export default function FloatingButtons() {
  return (
    <>
      {/* Right Side Rotated Vertical Action Tabs */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-2 items-end">
        <a
          href="#consultation"
          className="bg-[#7C3AED] text-white text-[11px] font-semibold tracking-wider px-4 py-2 rounded-l-md shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:bg-[#6D28D9] transition-all transform hover:-translate-x-1 uppercase [writing-mode:vertical-rl] rotate-180 flex items-center justify-center h-44"
        >
          BOOK A CONSULTATION
        </a>
        <a
          href="#whatsapp"
          className="bg-[#10B981] text-white text-[11px] font-semibold tracking-wider px-3 py-2 rounded-l-md shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:bg-[#059669] transition-all transform hover:-translate-x-1 uppercase [writing-mode:vertical-rl] rotate-180 flex items-center justify-center h-28"
        >
          WHATSAPP
        </a>
      </div>

      {/* Bottom Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          className="w-12 h-12 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.7)] hover:scale-110 active:scale-95 transition-transform"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4F8BFF] text-white flex items-center justify-center shadow-[0_0_25px_rgba(79,139,255,0.7)] hover:scale-110 active:scale-95 transition-transform"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
