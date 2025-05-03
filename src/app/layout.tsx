"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    fetch('/api/pageview', {
      method: 'POST',
    })
    .then(res => {
      if (!res.ok) {
        console.error('API call failed:', res.status, res.statusText);
      }
    })
    .catch(error => {
      console.error("Error fetching pageview API: ", error);
    });
  }, []);

  return (
    <html lang="ko" className="dark">
      <body className={`${inter.className} dark:bg-neutral-950 dark:text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
