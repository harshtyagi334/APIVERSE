import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "marketplace": "Marketplace",
        "playground": "Playground",
        "learning": "Learning Hub",
        "community": "Community",
        "pricing": "Pricing",
        "docs": "Documentation"
      },
      "hero": {
        "title": "Welcome to the APIVerse",
        "subtitle": "Discover, test, and integrate the world's most powerful APIs with AI-driven intelligence.",
        "cta": "Get Started",
        "secondary_cta": "Browse APIs"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
