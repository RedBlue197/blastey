"use client";

import { Inter } from "next/font/google";
import RootLayout from "./components/RootLayout"; // Adjust the path as needed
import { AuthProvider } from "@/context/AuthContext"; // Import the AuthProvider
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
        {/* You can add other meta tags and links here */}
      </head>
      <body className={inter.className}>
        {/* Wrap the RootLayout and children with AuthProvider */}
        <AuthProvider>
          <RootLayout>
            {children}
          </RootLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
