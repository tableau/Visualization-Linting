/* eslint-disable no-console */
import {lint} from '../src';
import {executePromisesInSeries, getFile} from 'hoopoe';
const summarizeResults = results => results.reduce((acc, d) => {
  acc[d.name] = d.passed;
  return acc;
}, {});

getFile('./test/gh-pages-vega-lite-charts.json')
  .then(d => JSON.parse(d))
  .then(GhGists => {
    executePromisesInSeries(GhGists.slice(101, 120).map(gistSpec => {
      return () => lint(gistSpec)
      .then(d => console.log(summarizeResults(d)))
      .catch(e => {
        console.log('OH NO A SPEC FAILED');
        console.log(gistSpec);
        console.log('\n\n\n\n');
        console.log(e);
      });
    }));
  });
/* eslint-enable no-console */
