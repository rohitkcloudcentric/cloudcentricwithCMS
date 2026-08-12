"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + diff, 100);
      });
    }, 120);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 700); // Allow fade animation to complete
    }, 1800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070709] transition-opacity duration-700 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-radial from-[#7C3AED]/20 via-[#4F8BFF]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Center Animated Logo / Glowing Ring */}
      <div className="relative flex flex-col items-center justify-center space-y-8 z-10">
        <div className="relative flex items-center justify-center">
          {/* Rotating Outer Glow Ring */}
          <div className="absolute w-36 h-36 rounded-full border border-t-[#7C3AED] border-r-transparent border-b-[#4F8BFF] border-l-transparent animate-spin" />
          <div className="absolute w-44 h-44 rounded-full border border-t-transparent border-r-[#8B5CF6]/40 border-b-transparent border-l-[#3B82F6]/40 animate-[spin_3s_linear_infinite_reverse]" />

          {/* CloudCentric Logo */}
          <div className="w-full h-auto relative flex items-center justify-center p-3 animate-pulse">
            <Image
              src="/logo.svg"
              alt="CloudCentric Logo"
              width={150}
              height={150}
              priority
              className="object-contain drop-shadow-[0_0_25px_rgba(124,58,237,0.7)]"
            />
          </div>
        </div>

        {/* CloudCentric Header Menu Logo */}
            </div>
    </div>
  );
}
