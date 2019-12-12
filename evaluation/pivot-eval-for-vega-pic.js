const {
  // getFile,
  writeFile,
} = require('hoopoe');

const metricsName = {
  // 'algebraic-randomly-delete-rows': 'Randomly Delete',
  'algebraic-bootstrap-bar-chart-bars': 'Bootstrap Input',
  'algebraic-within-group-bootstrap': 'With Mark Bootstrap',
  'algebraic-contract-to-floor-records--y-axis': 'Contract Records',
  // 'algebraic-decrease-by-one--y-axis': 'Decrease Mark Size by One',
  // 'algebraic-inflate-number-of-records-bootstrap--y-axis': 'Inflate Records',
  // 'algebraic-deduplicate-input-data': 'Deduplicate input',
  // 'algebraic-aggregates-should-have-a-similar-number-of-input-records--y-axis':
  //   'Aggregates have similar number of records',
  'algebraic-permute-relevant-columns': 'Randomize',
  // 'algebraic-shuffle-input-data': 'Shuffle',
  // 'algebraic-delete-some-of-relevant-columns': 'Null Some Data',
};
const metrics = Object.keys(metricsName);
const firstPart = require('./eval-results-the-third.js');
const secondPart = require('./eval-results-the-third-b.js');
Promise.all([
  // getFile('./evaluation/eval-results-the-third.json').then(d => JSON.parse(d)),
  // getFile('./evaluation/eval-results-the-third-b.json').then(d => JSON.parse(d))
  Promise.resolve(firstPart),
  Promise.resolve(secondPart),
]).then(([data1, data2]) => {
  const newData = data1.concat(data2).reduce((acc, row) => {
    const newRows = metrics.map(metric => {
      return {
        metric: metricsName[metric],
        metricVal: row[metric],
        errorType: row.errorType,
        levelOfDegrade: row.levelOfDegrade,
        runId: row.runId,
      };
    });
    return acc.concat(newRows);
  }, []);
  writeFile(
    './evaluation/pivoted-eval-results.json',
    JSON.stringify(newData, null, 2),
  );
});
