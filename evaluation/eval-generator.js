/* eslint-disable no-console */
import {lint} from '../src';
import {writeFile, executePromisesInSeries} from 'hoopoe';

const DEGRADE_SIZE = 6;
const TRIAL_SIZE = 5;
const buildChart = (errorType, levelOfDegrade, runId) => {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
    // an internal identifir just for us
    $$$identifier$$$: {errorType, levelOfDegrade, runId},
    data: {
      url: `./example-data/testData/${errorType}/${levelOfDegrade}/${runId}.csv`,
    },
    mark: 'bar',
    encoding: {
      x: {field: 'category', type: 'nominal', axis: {title: false}},
      y: {
        field: 'value',
        type: 'quantitative',
        aggregate: 'average',
        scale: {domain: [0, 320]},
        axis: {title: false},
      },
    },
  };
};

const prepareReport = ({lints}) => {
  return lints.reduce((acc, {name, passed}) => {
    acc[name] = passed;
    return acc;
  }, {});
};

console.log('generating targets');
const allTargets = ['missing', 'outliers', 'repeated'].reduce(
  (acc, errorType) => {
    const content = [...new Array(DEGRADE_SIZE)].reduce(
      (mem, _, levelOfDegrade) => {
        const trials = [...new Array(TRIAL_SIZE)].map((__, idx) =>
          buildChart(errorType, 3 * levelOfDegrade, idx),
        );
        return mem.concat(trials);
      },
      [],
    );
    return acc.concat(content);
  },
  [],
);

console.log('executing evaluations');
const startTime = new Date().getTime();
const results = [];
executePromisesInSeries(
  allTargets.map(chart => () => {
    console.log(`STARTING ${chart.data.url}`);
    return lint(chart, {noVisualExplain: true}).then(result => {
      console.log(`FINISHED ${chart.data.url}`);
      console.log(prepareReport(result));
      results.push({...prepareReport(result), ...chart.$$$identifier$$$});
    });
  }),
).then(() => {
  const endTime = new Date().getTime();
  const allKeys = Object.keys(
    results.reduce((acc, row) => {
      Object.keys(row).forEach(key => {
        acc[key] = true;
      });
      return acc;
    }, {}),
  );
  // make sure every row has every key
  const decoratedWithNulls = results.map(row => {
    return allKeys.reduce((acc, key) => {
      acc[key] = row[key];
      return acc;
    }, {});
  });
  writeFile(
    './evaluation/eval-results-3.json',
    JSON.stringify(decoratedWithNulls, null, 2),
  );
  console.log(`Took ${(endTime - startTime) / 1000}  seconds`);
});
