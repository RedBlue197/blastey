// components/RootLayout.tsx
"use client"; // Client component directive

import { useEffect } from "react";
import i18n from '../../i18n'; // Import the i18n configuration
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Dynamically set the language attribute on the HTML tag
    document.documentElement.lang = i18n.language || 'en';
  }, [i18n.language]);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default RootLayout;
