const {getFile, writeFile, executePromisesInSeries, executeCommandLineCmd} = require('hoopoe');

// getFile('./gh-specs/gh-specs-index
const isObject = x => typeof x === 'object';
const isString = x => typeof x === 'string';
const toFileList = ({stdout}) => stdout.split('\n').filter(d => d);
Promise.all([
  executeCommandLineCmd('ls gh-specs/vegalite-modified').then(toFileList),
  executeCommandLineCmd('ls gh-specs/data').then(toFileList),
  executeCommandLineCmd('ls example-specs/data').then(toFileList)
]).then(([specs, data, vegaDataSources]) => {
  const dataMap = data.reduce((acc, row) => {
    acc[row] = true;
    return acc;
  }, {});
  const toFix = specs.reduce((acc, row) => {
    if (!dataMap[row]) {
      acc[row] = true;
    }
    return acc;
  }, {});

  const vegaDataMap = vegaDataSources.reduce((acc, row) => {
    acc[row] = true;
    return acc;
  }, {});
  return Promise.all(Object.keys(toFix)
    .map(file => getFile(`./gh-specs/vegalite/${file}`)
      .then(d => JSON.parse(d))
      .then(d => {
        const {data} = d;
        if (!data) {
          return writeFile(`./gh-specs/vegalite-modified/${file}`, JSON.stringify(d));
        } else if (data && data.values) {
          return writeFile(`./gh-specs/vegalite-modified/${file}`, JSON.stringify(d));
        } else if (data && data.sequence || data.name) {
          return writeFile(`./gh-specs/vegalite-modified/${file}`, JSON.stringify(d));
        } else if (data && data.url && isObject(data.url)) {
          return writeFile(`./gh-specs/vegalite-modified/${file}`, JSON.stringify(d));
        } else if (data && data.url && data.url.startsWith('data/')) {
          return writeFile(`./gh-specs/vegalite-modified/${file}`, JSON.stringify(d));
        } else if (data && data.url && data.url.startsWith('./') && vegaDataMap[data.url.slice(2)]) {
          d.data.url = `data/${d.data.url.slice(2)}`;
          return writeFile(`./gh-specs/vegalite-modified/${file}`, JSON.stringify(d));
        } else if (data && isString(data.url) && vegaDataMap[data.url]) {
          d.data.url = `data/${d.data.url}`;
          return writeFile(`./gh-specs/vegalite-modified/${file}`, JSON.stringify(d));
        } else {
          console.log(file, d.data)
        }
      }).catch(e => console.log(e, file))

    )
  );
})
