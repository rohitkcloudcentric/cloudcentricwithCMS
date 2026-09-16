import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full antialiased dark">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#050505" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body className="min-h-full bg-[#050505] text-white flex flex-col font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
