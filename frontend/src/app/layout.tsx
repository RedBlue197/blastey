"use client";

import { Inter } from "next/font/google";
import RootLayout from "./components/RootLayout";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script"; // For inserting GTM and gtag scripts
import './styles/global.css'; // Import the global CSS here

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/blastey.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Your site description here" />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QYXT8DF8N8"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-QYXT8DF8N8');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) in body */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NHXB73QL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* AuthProvider ensures authentication state is available across the app */}
        <AuthProvider>
          <RootLayout>
            {children}
          </RootLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
