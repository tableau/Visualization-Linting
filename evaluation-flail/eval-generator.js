/* eslint-disable no-console */
import {lint} from '../src';
import {writeFile, getFile, executePromisesInSeries} from 'hoopoe';

const DEGRADE_SIZE = 5;
const TRIAL_SIZE = 1;
const buildChart = (errorType, levelOfDegrade, idx) => {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
    // an internal identifir just for us
    $$$identifier$$$: {errorType, levelOfDegrade, idx},
    data: {
      url: `./example-data/testData/${errorType}/${levelOfDegrade}/${idx}.csv`,
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
          buildChart(errorType, levelOfDegrade * 2 + 2, idx),
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
    // console.log(JSON.stringify(chart, null, 2));
    console.log(`STARTING ${chart.data.url}`);
    return lint(chart, {noVisualExplain: true}).then(result => {
      console.log(`FINISHED ${chart.data.url}`);
      console.log(prepareReport(result));
      results.push({...prepareReport(result)});
      // PROBABLY NEED TO SAVE THIS TO FILE AS WE GO
      return result;
    });
  }),
).then(() => {
  // console.log(results);
  const endTime = new Date().getTime();
  console.log(`Took ${(endTime - startTime) / 1000}  seconds`);
});
