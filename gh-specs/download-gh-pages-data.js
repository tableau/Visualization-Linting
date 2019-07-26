const {getFile, writeFile, executePromisesInSeries, executeCommandLineCmd} = require('hoopoe');
const fetch = require('node-fetch');
const failedFiles = {};
let alreadySeenFiles = {};

getFile('./gh-specs/gh-specs-index.json')
  .then(d => JSON.parse(d).vegalite)
  .then(files => {
    return Promise.all(files.map(fileName => {
      return getFile(`./gh-specs/vegalite/${fileName}`)
        .then(d => JSON.parse(d))
        .then(spec => {
          if (!(spec && spec.data && spec.data.url)) {
            return null;
          }
          if (typeof spec.data.url !== 'string') {
            return null;
          }
          return {url: spec.data.url, fileName};
        });
    }));
  })
  .then(files => {
    return executePromisesInSeries(files
      .filter(d => d && d.url && d.url.startsWith('http'))
      .map(({url, fileName}) => {
      return () => {
        // const alteredFileName = fileName.split('/')[fileName.split('/').length - 1];
        if (alreadySeenFiles[fileName]) {
          console.log('seen', url, fileName)
          return writeFile(`./gh-specs/data/${fileName}`, alreadySeenFiles[fileName]);
        }
        console.log('unseen', url, fileName)
        return fetch(url)
          .then(d => d.text())
          .then(d => {
            alreadySeenFiles[fileName] = d;
            return writeFile(`./gh-specs/data/${fileName}`, d)
          })
          .catch(e => {
            failedFiles[fileName] = true;
          })
      }
    }));
  }).then(() => console.log(failedFiles));
