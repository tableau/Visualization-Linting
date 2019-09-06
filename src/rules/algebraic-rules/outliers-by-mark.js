import {clone, prepProv, filterForMarkRecordChange} from '../../utils';
import {expectDifferent} from '../algebraic-detectors';

/**
 * HEY THIS ONE DOESN"T WORK
 * SPECIFICALLY: detecting "values" that go into the final group is hard, not done
 * relatively easy to compute the input tuples, but hard to know which part of them ends up going into mark
 */
const outliersByMark = ['x', 'y'].map(key => ({
  name: `algebraic-outlier-by-mark--${key}-axis`,
  type: 'algebraic-data',
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap} = prepProv(
      dataset,
      spec,
      view,
      key
    );
    console.log('??!???!???!');
    const data = clone(dataset);
    debugger;
    const arrayOfArrays = Object.keys(aggregateOutputPairs).map(
      terminalKey => tailToStartMap[terminalKey]
    );
    const maxSize = arrayOfArrays.reduce(
      (acc, val) => Math.max(acc, val.length),
      -Infinity
    );
    arrayOfArrays.forEach(targetArray => {
      // don't try to drop any records for single length data
      if (!targetArray || targetArray.length >= maxSize) {
        return;
      }
      for (let i = 0; i < maxSize - targetArray.length; i++) {
        const copyIndex =
          targetArray[Math.floor(Math.random() * targetArray.length)];
        data.push(data[copyIndex]);
      }
    });

    return data;
  },
  selectEvaluator: spec => () => false,
  filter: filterForMarkRecordChange(key),
  explain: 'XXXXXXX'
}));

export default outliersByMark;
