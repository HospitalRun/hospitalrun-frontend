import tosource from 'tosource-polyfill';
import fs from 'fs';
import path from 'path';
import rootTranslation from '../../app/locales/en/translations';

let translationsDir = path.join(__dirname, '..', '..', 'app', 'locales');
let rootTranslationName = 'en';
let allTranslations = getDirectories(translationsDir).sort();

console.log(`Detected the following languages: ${allTranslations.join(', ')}`);

if (!allTranslations.includes(rootTranslationName))
  throw `Can't find root language ${rootTranslationName} in ${allTranslations.join(', ')}`;

console.log(`Selecting ${rootTranslationName} as root language`);

let sortedRootTranslation = recursiveSortObjectKeys(rootTranslation);

for (let language of allTranslations) {
  console.log(`Syncing translation of ${language} to ${rootTranslationName}`);

  // Because the path to import is dynamic, we can't use import of es6
  // And also the import object has the key default
  let nonRootTranslation = require(`../../app/locales/${language}/translations`);
  nonRootTranslation = nonRootTranslation.default;

  let syncedTranslation = recursiveSyncTranslation(sortedRootTranslation, nonRootTranslation);

  let fileToWrite = path.join(__dirname, `../../app/locales/${language}/translations.js`)
  let contentToWrite = `export default ${stringifyObjectWithoutQuotes(syncedTranslation)};`
  writeToFile(fileToWrite, contentToWrite);
}

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function recursiveSortObjectKeys(obj){
  if (typeof(obj) !== 'object') return obj;

  if (obj.constructor === Object) {
    let sortedObj = {};
    Object.keys(obj).sort().forEach((objKey) => {
      sortedObj[objKey] = recursiveSortObjectKeys(obj[objKey]);
    });
    return sortedObj;
  } else if (obj.constructor === Array) {
    return obj.map(recursiveSortObjectKeys);
  } else {
    return obj;
  }
}

function stringifyObjectWithoutQuotes(obj) {
  return tosource(obj);
}

function writeToFile(fileName, content) {
  fs.writeFile(fileName, content, (err) => {
    if(err) { return console.error(err); }
  });
}

function recursiveSyncTranslation(src, dst) {
  if (src.constructor === Object) {
    let syncedObject = {};
    Object.keys(src).forEach((objKey) => {
      syncedObject[objKey] = recursiveSyncTranslation(src[objKey], dst[objKey] || emptySameType(src[objKey]));
    });
    return syncedObject;
  } else if (src.constructor === Array) {
    let syncedArray = [];
    for (let idx = 0; idx < src.length; idx++) {
      syncedArray.push(recursiveSyncTranslation(src[idx], dst[idx] || emptySameType(src[idx])));
    }
    return syncedArray;
  } else {
    return dst;
  }
}

function emptySameType(obj) {
  if (obj.constructor === Object) {
    return {};
  } else if (obj.constructor === Array) {
    return [];
  } else {
    return '';
  }
}
