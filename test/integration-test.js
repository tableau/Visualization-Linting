/* eslint-disable no-console */
import {lint} from '../src';
import {executePromisesInSeries, getFile} from 'hoopoe';
import {CRASH} from '../src/codes';

function integrationTest(directory, dirPresent) {
  const startTime = new Date().getTime();
  let failedSpecs = 0;
  let specCounter = 0;
  const codeCounts = {};
  const evalEpec = fileNames => spec => {
    specCounter += 1;
    const fileName = fileNames[specCounter - 1];
    console.log(`Linting ${specCounter} ${fileName}`);
    return lint(spec)
    .then(d => {
      console.log(`LINT RESULTS IN A ${d.code}${d.msg ? `: ${d.msg}` : ''}\n`);
      // codeCounts[d.code] = (codeCounts[d.code] || 0) + 1;
      codeCounts[d.code] = (codeCounts[d.code] || []).concat(fileName);
    })
    .catch(e => {
      console.log(`OH NO A ${fileName} FAILED`);
      failedSpecs += 1;
    });
  };
  let totalSpecs = 0;
  return getFile(directory)
  .then(d => JSON.parse(d))
  .then(vlExamples => {
    const subslice = vlExamples.vegalite;
    totalSpecs = subslice.length;
    return executePromisesInSeries(subslice.map(fileName => {
      return () =>
      getFile(dirPresent(fileName))
      .then(d => JSON.parse(d))
      .then(evalEpec(subslice));
    }));
  })
  .then(() => {
    const endTime = new Date().getTime();
    console.log(`${Math.round((endTime - startTime) / 1000)} total seconds`);
    console.log(`${totalSpecs - failedSpecs} / ${totalSpecs} completely executed specs`);
    console.table(Object.entries(codeCounts).map(([code, files]) => ({code, count: files.length})));
    console.log(`Crashed specs: ${codeCounts[CRASH]}`);
  });
}

integrationTest('./example-specs/examples-index.json', fileName => `./example-specs/vegalite/${fileName}`);
// integrationTest('./gh-specs/gh-specs-index.json', fileName => `./gh-specs/vegalite/${fileName}`);

/* eslint-enable no-console */
