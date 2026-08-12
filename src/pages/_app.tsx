import type { AppProps } from "next/app";
import { Geist, Geist_Mono, Duru_Sans, Intel_One_Mono, Manrope } from "next/font/google";
import Preloader from "@/components/common/Preloader";
import "../pages/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const duruSans = Duru_Sans({
  weight: "400",
  variable: "--font-duru-sans",
  subsets: ["latin"],
  display: "swap",
});

const intelOneMono = Intel_One_Mono({
  weight: "400",
  variable: "--font-intel-one-mono",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} ${duruSans.variable} ${intelOneMono.variable} ${manrope.variable} h-full antialiased dark`}>
      <Preloader />
      <Component {...pageProps} />
    </div>
  );
}
