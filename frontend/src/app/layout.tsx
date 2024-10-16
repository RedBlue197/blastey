"use client";

import { Inter } from "next/font/google";
import RootLayout from "./components/RootLayout";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script"; // For inserting GTM script
import './globals.css';

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

        {/* Google Tag Manager script in head */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NHXB73QL');
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
