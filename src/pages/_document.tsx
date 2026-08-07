import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="h-full antialiased dark">
      <Head>
        <meta
          name="description"
          content="We help modern businesses adopt AI, automate workflows, optimize customer experiences, and build scalable digital ecosystems."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="min-h-full bg-[#050505] text-white flex flex-col font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
