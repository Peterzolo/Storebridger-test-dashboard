/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import i18next from 'i18next';
import { logger } from '../library/helpers';
import Backend from 'i18next-fs-backend';
import en from './en/translation.json';
import LanguageDetector from 'i18next-browser-languagedetector';

import { ConvertedToObjectType, TranslationJsonType } from './types';

export const translations: ConvertedToObjectType<TranslationJsonType> = {} as any;

/*
 * Converts the static JSON file into an object where keys are identical
 * but values are strings concatenated according to syntax.
 * This is helpful when using the JSON file keys and still having the intellisense support
 * along with type-safety
 */
export const convertLanguageJsonToObject = (json: any, objToConvertTo = translations, current?: string) => {
  Object.keys(json).forEach((key) => {
    const currentLookupKey = current ? `${current}.${key}` : key;
    if (typeof json[key] === 'object') {
      objToConvertTo[key] = {};
      convertLanguageJsonToObject(json[key], objToConvertTo[key], currentLookupKey);
    } else {
      objToConvertTo[key] = currentLookupKey;
    }
  });
};

export const translationsJson = {
  en: {
    translation: en,
  },
};

const configureI18tn = () => {
  // Create the 'translations' object to provide full intellisense support for the static json files.
  convertLanguageJsonToObject(en);

  i18next
    .use(Backend)
    .use(LanguageDetector)
    .init(
      {
        // debug: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
        lng: 'en',
        resources: translationsJson,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },
      },
      (err) => {
        if (err) {
          logger.error(`
        Error with i18n configuration
        ${err}
        `);
        }
      },
    );

  return i18next;
};

export const i18n = configureI18tn();
