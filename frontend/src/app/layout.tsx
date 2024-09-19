// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayout from "./components/RootLayout"; // Adjust the path as needed
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blastey - Home",
  description: "Blastey is the go-to marketplace for travelers and locals",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* You can add other meta tags and links here */}
      </head>
      <body className={inter.className}>
        <RootLayout>
          {children}
        </RootLayout>
      </body>
    </html>
  );
}
