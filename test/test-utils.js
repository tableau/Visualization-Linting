/* eslint-disable no-console*/
const fs = require('fs');

export const writeFile = (fileName, contents) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, contents.slice(0, contents.length), (err) => {
    if (err) {
      console.log('WRITE FILE ERROR', fileName);
      reject(err);
      return;
    }
    resolve();
  });
});
/* eslint-enable no-console*/
