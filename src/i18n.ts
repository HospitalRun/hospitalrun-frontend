import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import translationAR from './locales/ar/translations'
import translationDE from './locales/de/translations'
import translationEnUs from './locales/enUs/translations'
import translationES from './locales/es/translations'
import translationFR from './locales/fr/translations'
import translationID from './locales/id/translations'
import translationIT from './locales/it/translations'
import translationJA from './locales/ja/translations'
import translationPtBR from './locales/ptBr/translations'
import translationRU from './locales/ru/translations'
import translationZhCN from './locales/zhCN/translations'

const resources: { [language: string]: any } = {
  it: {
    name: 'Italian',
    translation: translationIT,
  },
  ar: {
    name: 'Arabic',
    translation: translationAR,
  },
  de: {
    name: 'German',
    translation: translationDE,
  },
  en: {
    name: 'English, American',
    translation: translationEnUs,
  },
  es: {
    name: 'Spanish',
    translation: translationES,
  },
  fr: {
    name: 'French',
    translation: translationFR,
  },
  id: {
    name: 'Indonesian',
    translation: translationID,
  },
  ja: {
    name: 'Japanese',
    translation: translationJA,
  },
  ptBR: {
    name: 'Portuguese',
    translation: translationPtBR,
  },
  ru: {
    name: 'Russian',
    translation: translationRU,
  },
  zhCN: {
    name: 'Chinese',
    translation: translationZhCN,
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
export { resources }
