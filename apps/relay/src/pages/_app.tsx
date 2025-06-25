import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Inter, Geist_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap" });
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
        className={`${inter.className} ${geistMono.className}`}
        style={{ height: "100%", minHeight: "100vh" }}
      >
        <Component {...pageProps} />
      </div>
    </>
  );
}
