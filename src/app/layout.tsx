import type { Metadata } from "next";
import { Geist, Geist_Mono, Duru_Sans, Intel_One_Mono, Manrope } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const duruSans = Duru_Sans({
  weight: "400",
  variable: "--font-duru-sans",
  subsets: ["latin"],
});

const intelOneMono = Intel_One_Mono({
  weight: "400",
  variable: "--font-intel-one-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudCentric - Where Artificial Intelligence Meets Business Innovation",
  description:
    "We help modern businesses adopt AI, automate workflows, optimize customer experiences, and build scalable digital ecosystems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${duruSans.variable} ${intelOneMono.variable} ${manrope.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#050505] text-white flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
