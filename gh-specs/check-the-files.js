const {getFile, writeFile, executePromisesInSeries, executeCommandLineCmd} = require('hoopoe');

getFile('./gh-specs/gh-specs-index.json')
  .then(d => JSON.parse(d).vegalite)
  .then(fileNames => {
    return Promise.all(fileNames.map(fileName => {
      return getFile(`./gh-specs/vegalite/${fileName}`)
        .then(d => JSON.parse(d))
        .then(spec => {
          if (!spec) {
            console.log(fileName)
          }
        });
    }))
  })
