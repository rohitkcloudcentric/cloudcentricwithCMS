import type { AppProps } from "next/app";
import { Geist, Geist_Mono, Duru_Sans, Intel_One_Mono, Manrope, Caveat } from "next/font/google";
import Script from "next/script";
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

const caveat = Caveat({
  weight: ["400", "600", "700"],
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

import SEOHead from "@/components/seo/SEOHead";
import FloatingButtons from "@/components/common/FloatingButtons";
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/sitemap-helper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} ${duruSans.variable} ${intelOneMono.variable} ${manrope.variable} ${caveat.variable} h-full antialiased dark`}>
      {/* Google Analytics Script */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6LZ0CMGG00"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-6LZ0CMGG00');
        `}
      </Script>

      <SEOHead jsonLd={[ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, LOCAL_BUSINESS_SCHEMA]} />
      <Preloader />
      <Component {...pageProps} />
      <FloatingButtons />
    </div>
  );
}
