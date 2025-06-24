import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Telegraph Buiilder</title>
        <meta name="description" content="Telegraph Builder" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${inter.className}`}
        style={{ height: "100%", minHeight: "100vh" }}
      >
        <Component {...pageProps} />
      </div>
    </>
  );
}
