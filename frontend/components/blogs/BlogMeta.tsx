"use client";

interface BlogMetaProps {
  category: string;
  readTime: string;
  author?: string;
  date?: string;
}

export default function BlogMeta({
  category,
  readTime,
  author = "BY GARGI SHUKLA",
  date = "AUGUST 12, 2026",
}: BlogMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-white/[0.03] font-intel">
        {category}
      </span>
      <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-white/[0.03] font-intel">
        {readTime}
      </span>
      <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-white/[0.03] font-intel">
        {author}
      </span>
      <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-white/[0.03] font-intel">
        {date}
      </span>
    </div>
  );
}
