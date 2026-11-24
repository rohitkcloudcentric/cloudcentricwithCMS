"use client";

import { useState, useEffect } from "react";
import { Sparkles, Paperclip, ChevronRight } from "lucide-react";

const PLACEHOLDER_PHRASES = [
  "What would you like AI to automate?",
  "Build intelligent Salesforce workflows...",
  "Deploy autonomous AI agents for your business...",
  "Optimize enterprise cloud infrastructure...",
  "Transform customer experience with generative AI...",
];

export default function AIChatBar() {
  const [mounted, setMounted] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Typewriter effect state
  const [placeholderText, setPlaceholderText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));

    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      cancelAnimationFrame(handle);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Typewriter animation effect
  useEffect(() => {
    if (!mounted) return;

    const currentPhrase = PLACEHOLDER_PHRASES[phraseIndex];
    let typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      typingSpeed = 400;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setPlaceholderText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholderText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PLACEHOLDER_PHRASES.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [mounted, charIndex, isDeleting, phraseIndex]);

  // Submit handler: opens the chatbot panel on the right side of the screen
  const handleSubmitPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptToSend = (inputValue.trim() || placeholderText.trim() || "Hi").replace(/[|]/g, "").trim();

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-ai-chat-panel", {
          detail: { message: promptToSend },
        })
      );
    }
    setInputValue("");
  };

  const handleSparklesClick = () => {
    const nextPhrase = PLACEHOLDER_PHRASES[(phraseIndex + 1) % PLACEHOLDER_PHRASES.length];
    setInputValue(nextPhrase);
  };

  const handlePaperclipClick = () => {
    const defaultDocPrompt = "I would like to inquire about CloudCentric's enterprise AI and documentation capabilities.";
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-ai-chat-panel", {
          detail: { message: defaultDocPrompt },
        })
      );
    }
  };

  if (!mounted) return null;

  return (
    <form
      onSubmit={handleSubmitPrompt}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-[650px] h-[54px] rounded-full p-[6px] pl-[8px] flex items-center justify-between border transition-all duration-500 ease-out hover:border-white/[0.4] pointer-events-auto ${
        isFixed
          ? "bg-[#0A0A0C]/90 backdrop-blur-[24px] border-[#7C3AED]/60 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(124,58,237,0.5)] scale-100 opacity-100"
          : "bg-[#0A0A0C]/80 backdrop-blur-[16px] border-white/[0.2] shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(124,58,237,0.3)] scale-100 opacity-100"
      }`}
    >
      {/* Left Quick Icons */}
      <div className="flex items-center space-x-1.5">
        <button
          type="button"
          onClick={handleSparklesClick}
          aria-label="AI Feature Suggestions"
          title="Cycle AI Suggestions"
          className="w-8 h-8 rounded-full bg-white/[0.9] text-[#18181b] hover:bg-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handlePaperclipClick}
          aria-label="Attach File or Documentation Inquiry"
          title="Inquire with Documentation Context"
          className="w-8 h-8 rounded-full bg-white/[0.9] text-[#18181b] hover:bg-white flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Paperclip className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Input with animated typewriter placeholder */}
      <input
        type="text"
        aria-label="Ask AI input prompt"
        placeholder={inputValue ? "" : `${placeholderText}|`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-white placeholder-white/80 px-4 font-[family:var(--font-intel-one-mono)] font-medium"
      />

      {/* Purple Action Button */}
      <button
        type="submit"
        aria-label="Submit Prompt to AI Chatbot"
        title="Submit to Chatbot"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(124,58,237,0.55)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      >
        <ChevronRight className="w-4 h-4 stroke-[3]" />
      </button>
    </form>
  );
}
