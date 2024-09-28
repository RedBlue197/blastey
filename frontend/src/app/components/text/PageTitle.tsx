import React, { useEffect } from 'react';
import Head from 'next/head';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="mb-8">
      <Head>
        <title>{title}</title>
      </Head>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{title}</h1>
      {subtitle && <h2 className="text-2xl font-medium text-gray-600">{subtitle}</h2>}
    </div>
  );
};

export default PageTitle;
