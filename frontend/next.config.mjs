/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['static.avianca.com', 'static-nuxqa.avtest.ink', 'static.avianca.com'], // Add other domains if needed
    },
    i18n: {
        locales: ['en', 'fr'], // List of locales you are supporting
        defaultLocale: 'en', // Default locale
      },
      
};

export default nextConfig;
