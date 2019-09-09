import {clone, prepProv, filterForMarkRecordChange} from '../../utils';
import {bootstrap} from '../../bootstrap';
import {
  expectSameBars,
  expectSameLines,
  expectSame,
  testInsturment,
} from '../algebraic-detectors';

const inflateToCommonNumberOfRecords = ['y'].map(key => ({
  name: `algebraic-inflate-number-of-records-bootstrap--${key}-axis`,
  type: 'algebraic-stat-data',
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap} = prepProv(
      dataset,
      spec,
      view,
      key,
    );
    let data = [];
    const arrayOfArrays = Object.keys(aggregateOutputPairs).map(
      terminalKey => tailToStartMap[terminalKey],
    );
    const maxSize = arrayOfArrays.reduce(
      (acc, val) => Math.max(acc, val.length),
      -Infinity,
    );
    arrayOfArrays.forEach(targetArray => {
      // don't try to drop any records for single length data
      if (!targetArray) {
        return;
      }
      data = data.concat(
        bootstrap(targetArray)
          .samples(maxSize)
          .map(idx => dataset[idx]),
      );
    });

    return data;
  },
  statisticalEval: results => {
    const numPassing = results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0);
    console.log('inflate to max records', numPassing);
    return false;
    // return numPassing > 333;
  },
  generateNumberOfIterations: (dataset, spec, view) => 100,
  selectEvaluator: testInsturment,
  filter: filterForMarkRecordChange(key),
  explain:
    'bootstrapping the aggregate values to the max number of records should affect the chart',
}));

export default inflateToCommonNumberOfRecords;
