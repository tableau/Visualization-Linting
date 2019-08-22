const {writeFile} = require('hoopoe');
const {BAD_CHARTS} = require('../test/vega-examples');
//
//   })

Object.entries(BAD_CHARTS).forEach(([key, spec]) => {
  const modifiedSpec = spec;
  if (modifiedSpec.data.url && modifiedSpec.data.url.startsWith('../')) {
    modifiedSpec.data.url = modifiedSpec.data.url.slice(3);
  }
  writeFile(
    `./by-hand-examples/vegalite/${key}.vl.json`,
    JSON.stringify(modifiedSpec, null, 2)
  );
  writeFile(
    './by-hand-examples/index.json',
    JSON.stringify(
      {vegalite: Object.keys(BAD_CHARTS).map(d => `${d}.vl.json`)},
      null,
      2
    )
  );
});
