import translationAR from './ar/translations'
import translationDE from './de/translations'
import translationEnUs from './enUs/translations'
import translationES from './es/translations'
import translationFR from './fr/translations'
import translationID from './id/translations'
import translationIT from './it/translations'
import translationJA from './ja/translations'
import translationPtBR from './ptBr/translations'
import translationRU from './ru/translations'
import translationTR from './tr/translations'
import translationZhCN from './zhCN/translations'

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
  tr: {
    name: 'Turkish',
    translation: translationTR,
  },
  zhCN: {
    name: 'Chinese',
    translation: translationZhCN,
  },
}

export default resources
