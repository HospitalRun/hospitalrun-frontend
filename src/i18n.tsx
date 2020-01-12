import i18n from 'i18next';
// import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationAR from './locales/ar/translation.json';
import translationDE from './locales/de/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationIN from './locales/in/translation.json';
import translationJA from './locales/ja/translation.json';
import translationPT from './locales/pt/translation.json';
import translationRU from './locales/ru/translation.json';
import translationZR from './locales/zr/translation.json';

const resources = {
  ar: {
    translation: translationAR,
  },
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  in: {
    translation: translationIN,
  },
  ja: {
    translation: translationJA,
  },
  pt: {
    translation: translationPT,
  },
  ru: {
    translation: translationRU,
  },
  zr: {
    translation: translationZR,
  },
};

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend

  // SET UP Backend resource
  // .use(Backend)


  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,
    resources: resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
