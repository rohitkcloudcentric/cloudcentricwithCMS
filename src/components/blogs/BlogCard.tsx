"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  readTime: string;
  image: string;
  date?: string;
  author?: string;
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Odd card (index 0, 2, 4...) comes from left (-translate-x-16)
  // Even card (index 1, 3, 5...) comes from right (translate-x-16)
  const isOdd = index % 2 === 0;
  const initialTransform = isOdd ? "-translate-x-16" : "translate-x-16";

  return (
    <Link
      ref={cardRef}
      href={`/blogs/${post.slug}`}
      className={`group flex flex-col justify-between p-6 sm:p-7 rounded-[20px] bg-[#000000] border border-white/15 hover:border-white/35 transition-all duration-800 ease-out transform shadow-[0_15px_40px_rgba(0,0,0,0.85)] relative overflow-hidden h-full cursor-pointer gap-6 ${
        isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${initialTransform}`
      }`}
    >
      {/* Upper Content: Text Left & Diagram Image Right */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-5 sm:gap-6">
        {/* Left Column: Title & Description */}
        <div className="flex-1 flex flex-col space-y-3">
          <h3 className="text-xl sm:text-2xl lg:text-[25px] font-normal text-white leading-[1.22] tracking-tight font-duru group-hover:text-white transition-colors">
            {post.title}
          </h3>
          <p className="text-xs sm:text-sm text-white/60 font-intel font-light leading-relaxed line-clamp-3">
            {post.description}
          </p>
        </div>

        {/* Right Column: Featured AI Diagram Box */}
        <div className="w-full sm:w-[200px] md:w-[230px] lg:w-[240px] h-[160px] sm:h-[180px] rounded-[14px] overflow-hidden shrink-0 relative">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            loading="lazy"
            className="object-contain object-center group-hover:scale-[1.03] transition-transform duration-500 p-1"
          />
        </div>
      </div>

      {/* Bottom Full-Width Strip: Pills Left & White Circle Arrow Right */}
      <div className="pt-2 flex items-center justify-between w-full mt-auto">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-transparent font-intel">
            {post.category}
          </span>
          <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-transparent font-intel">
            {post.readTime}
          </span>
        </div>

        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300 shrink-0">
          <ChevronRight className="w-5 h-5 stroke-[2.5] transition-colors duration-300" />
        </div>
      </div>
    </Link>
  );
}
