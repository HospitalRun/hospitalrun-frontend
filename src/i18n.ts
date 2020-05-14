import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import translationAR from './locales/ar/translations'
import translationDE from './locales/de/translations'
import translationEnUs from './locales/enUs/translations'
import translationES from './locales/es/translations'
import translationFR from './locales/fr/translations'
import translationIN from './locales/in/translations'
import translationJA from './locales/ja/translations'
import translationPtBR from './locales/ptBr/translations'
import translationRU from './locales/ru/translations'
import translationZR from './locales/zr/translations'
import translationIT from './locales/it/translations'

const resources = {
  it: {
    translation: translationIT,
  },
  ar: {
    translation: translationAR,
  },
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEnUs,
  },
  es: {
    translation: translationES,
  },
  fr: {
    translation: translationFR,
  },
  in: {
    translation: translationIN,
  },
  ja: {
    translation: translationJA,
  },
  pt: {
    translation: translationPtBR,
  },
  ru: {
    translation: translationRU,
  },
  zr: {
    translation: translationZR,
  },
}

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
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
    resources,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
