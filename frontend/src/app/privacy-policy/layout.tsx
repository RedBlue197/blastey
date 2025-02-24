// components/SignInLayout.tsx
import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Privacy Policy - Blastey",
  description: "Privacy policy of Blastey.",
};

interface SignInLayoutProps {
  children: React.ReactNode;
}

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return (
    <div className="signInContainer">
      {children}
    </div>
  );
};

export default SignInLayout;
