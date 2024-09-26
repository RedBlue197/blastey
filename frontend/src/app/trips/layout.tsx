app/layout.tsx
import type { Metadata } from "next";
import './globals.css'


export const metadata: Metadata = {
  title: "Trips - Blastey",
  description: "View the trips and select the prefered one",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );