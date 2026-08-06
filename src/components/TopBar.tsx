"use client";

import { useState } from "react";

export default function TopBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-slate-800 dark:text-slate-100 text-sm py-2 px-4 shadow-sm border-b border-slate-300/40 dark:border-slate-700/40">
      <div className="max-w-7xl mx-auto flex items-center justify-center relative">
        <div className="flex items-center space-x-2 text-center">
          <span className="font-normal text-md tracking-wide">
            Ready to Transform Your Business with AI &amp; Intelligent Automation?
          </span>
          <a
            href="#contact"
            className="inline-flex items-center font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors duration-150 ml-1 group"
          >
            <span>Let's Talk</span>
            <svg
              className="w-4 h-4 ml-1 transition-transform duration-150 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded"
          aria-label="Dismiss Topbar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
