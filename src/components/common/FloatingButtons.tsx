"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ArrowUp } from "lucide-react";
import AIChatBar from "./AIChatBar";

export default function FloatingButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleOpenChatEvent = () => {
      setIsChatOpen(true);
    };

    window.addEventListener("open-ai-chat", handleOpenChatEvent);
    return () => {
      window.removeEventListener("open-ai-chat", handleOpenChatEvent);
    };
  }, []);

  useEffect(() => {
    if (!isChatOpen) return;

    const handleScroll = () => {
      setIsChatOpen(false);
    };

    // Close chat bar on scroll
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isChatOpen]);

  return (
    <>
      {/* Right Side Rotated Vertical Action Tabs */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col  items-center gap-8">
      
        <Link
          href="/contact-us"
          aria-label="Book a consultation"
          className="bg-gradient-to-b from-[#2563EB] to-[#9333EA] text-white text-[11px] font-[family:var(--font-intel-one-mono)] font-extrabold tracking-[0.15em] w-[38px] py-1 rounded-lg shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.5)] hover:-translate-x-1 hover:scale-105 transition-all duration-300 uppercase [writing-mode:vertical-rl] px-3 flex items-center justify-center h-auto text-center cursor-pointer"
        >
          BOOK A CONSULTATION
        </Link>
        <a
          href="https://api.whatsapp.com/send/?phone=9971126721&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          className="bg-[#22C55E] text-white text-[11px] font-[family:var(--font-intel-one-mono)] font-extrabold tracking-[0.15em] w-[38px] py-1 px-3 rounded-lg shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_25px_rgba(34,197,94,0.5)] hover:-translate-x-1 hover:scale-105 transition-all duration-300 uppercase [writing-mode:vertical-rl] flex items-center justify-center h-auto text-center cursor-pointer"
        >
          WHATSAPP
        </a>
      </div>

      {/* Bottom Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="w-12 h-12 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.7)] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#4F8BFF] text-white flex items-center justify-center shadow-[0_0_25px_rgba(79,139,255,0.7)] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      {/* Conditionally rendered AI Chat Bar */}
      {isChatOpen && <AIChatBar />}
    </>
  );
}
