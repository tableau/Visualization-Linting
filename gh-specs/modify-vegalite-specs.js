const {getFile, writeFile, executePromisesInSeries, executeCommandLineCmd} = require('hoopoe');

getFile('./gh-specs/gh-specs-index.json')
  .then(d => JSON.parse(d).vegalite)
  .then(fileNames => {
    return Promise.all(fileNames.map(fileName => {
      return getFile(`./gh-specs/vegalite/${fileName}`)
        .then(d => JSON.parse(d))
        .then(spec => {
          if ((spec && spec.data && spec.data.url) && typeof spec.data.url === 'string') {
            spec.data.url = `./gh-specs/data/${fileName}`;
          }
          return writeFile(`./gh-specs/vegalite-modified/${fileName}`, JSON.stringify(spec, null, 2))
        });
    }))
  })
