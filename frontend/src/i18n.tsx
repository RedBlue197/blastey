import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Import LanguageDetector

// Import translation files
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  // Add more languages here
};

i18n
  .use(LanguageDetector) // Use LanguageDetector
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // Default language (used if language detection fails) - you can remove this and rely solely on the browser detection
    fallbackLng: 'en', // Fallback language if the selected language is not available
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    detection: {  // Configuration options for the language detector
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'], // Detection order
      caches: ['localStorage', 'cookie'], // Caches to use
    },
  });

export default i18n;