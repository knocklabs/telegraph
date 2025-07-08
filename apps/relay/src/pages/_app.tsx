import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Inter, Geist_Mono } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Sync session token between cookie and localStorage
    const syncSessionToken = () => {
      const localToken = localStorage.getItem('relay_session');
      
      if (!localToken) {
        // Try to read from cookie and copy to localStorage
        const cookieString = document.cookie;
        const sessionCookie = cookieString
          .split('; ')
          .find((cookie) => cookie.startsWith('relay_session='));
        
        if (sessionCookie) {
          const token = sessionCookie.split('=')[1];
          localStorage.setItem('relay_session', token);
        }
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      syncSessionToken();
    }
  }, []);

  // Check if user should be redirected to login
  useEffect(() => {
    const checkAuth = () => {
      // Skip auth check for login page and auth routes
      if (router.pathname === '/login' || router.pathname.startsWith('/api/auth')) {
        return;
      }

      const token = localStorage.getItem('relay_session');
      if (!token) {
        router.push('/login');
      }
    };

    // Only run on client side and after router is ready
    if (typeof window !== 'undefined' && router.isReady) {
      checkAuth();
    }
  }, [router.isReady, router.pathname]);

  // Logout function that can be used globally
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('relay_session');
      router.push('/login');
    }
  };

  // Add logout function to window for global access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).logout = logout;
    }
  }, []);

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
