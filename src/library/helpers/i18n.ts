import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { readdirSync, lstatSync } from 'fs';
import logger from './logger';

export const configureI18tn = () => {
  const localesPath = path.join(__dirname, '../../locales');

  i18next.use(Backend).init(
    {
      // debug: true,
      initImmediate: false,
      fallbackLng: 'en',
      lng: 'en',
      preload: readdirSync(localesPath).filter((fileName) => {
        const joinedPath = path.join(localesPath, fileName);
        const isDirectory = lstatSync(joinedPath).isDirectory();
        return isDirectory;
      }),
      ns: 'translation',
      defaultNS: 'translation',
      backend: {
        loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),
        addPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.missing.json'),
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
