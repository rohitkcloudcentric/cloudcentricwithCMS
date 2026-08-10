import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full antialiased dark">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#050505" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="min-h-full bg-[#050505] text-white flex flex-col font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
