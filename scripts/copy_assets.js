/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-alert, no-console */

const fs = require('fs-extra');
const path = require('path');

const copyLocales = () => {
  const source = path.join(__dirname, '../src/locales');
  const destination = path.join(__dirname, '../build/locales');
  fs.copy(source, destination, function (err) {
    if (err) {
      console.log('An error occured while copying the folder.');
      return console.error(err);
    }
    console.log('Copy completed!');
  });
};

const copyEmailViews = () => {
  const source = path.join(__dirname, '../src/views');
  const destination = path.join(__dirname, '../build/views');
  fs.copy(source, destination, function (err) {
    if (err) {
      console.log('An error occured while copying the folder.');
      return console.error(err);
    }
    console.log('Copy completed!');
  });
};

copyLocales();
copyEmailViews();
