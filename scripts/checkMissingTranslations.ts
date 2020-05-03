import { Resource, ResourceKey } from 'i18next'
import chalk from 'chalk'
import i18n from '../src/i18n'

const error = chalk.bold.red
const warning = chalk.keyword('orange')
const success = chalk.keyword('green')

const checkRecursiveTranslation = (
  comparingLanguage: string,
  searchingPath: string[],
  defaultLanguageObject: ResourceKey,
  comparingLanguageObject: ResourceKey,
) => {
  if (typeof defaultLanguageObject === 'string' || typeof comparingLanguageObject === 'string') {
    if (typeof defaultLanguageObject === 'object') {
      console.log(
        warning(
          `Found a string for path ${searchingPath.join(
            '-->',
          )} and language ${comparingLanguage} while is and object for the default language`,
        ),
      )
    }
    return
  }
  const defaultKeys: string[] = Object.keys(defaultLanguageObject)
  const translatedKeys: string[] = Object.keys(comparingLanguageObject)
  if (defaultKeys.length === 0 || translatedKeys.length === 0) {
    return
  }
  defaultKeys.forEach((key) => {
    if (!comparingLanguageObject[key]) {
      console.warn(
        warning(
          `The key ${key} is not present for path ${searchingPath.join(
            '-->',
          )} and language ${comparingLanguage}`,
        ),
      )
    } else {
      checkRecursiveTranslation(
        comparingLanguage,
        [...searchingPath, key],
        defaultLanguageObject[key],
        comparingLanguageObject[key],
      )
    }
  })
}

const run = () => {
  const resources: Resource = i18n.options.resources ?? {}
  const languages = Object.keys(resources)
  const defaultLanguage = 'en'
  console.log(
    success(
      '🏁 Start finding translation problem comparing all languages with the default one (English)',
    ),
  )
  console.log('')
  if (!resources[defaultLanguage]) {
    console.log(error('We have a big problem.... the english language is not found!'))
    process.exit(1)
  }

  languages.forEach((language) => {
    if (language === defaultLanguage) {
      return
    }
    console.log(success(`Checking ${language}`))
    console.log('')
    checkRecursiveTranslation(language, [language], resources[defaultLanguage], resources[language])
    console.log('')
  })
}

run()
