import {clone, filterForAggregates, prepProv} from '../../utils';
import {expectDifferent} from '../algebraic-detectors';

const filterForMarkRecordChange = key => (spec, data, view) => {
  if (data.length === 0) {
    return false;
  }
  if (spec.encoding && (!spec.encoding.x || !spec.encoding.y)) {
    return false;
  }
  if (!filterForAggregates(key)(spec, data, view)) {
    return false;
  }
  const {aggregateOutputPairs, tailToStartMap} = prepProv(
    data,
    spec,
    view,
    key
  );
  const allAggsConsistOfOneRecord = Object.entries(aggregateOutputPairs).every(
    ([terminalKey, aggValue]) => (tailToStartMap[terminalKey] || []).length <= 1
  );
  if (allAggsConsistOfOneRecord) {
    return false;
  }
  return true;
};

export const inflateToCommonNumberOfRecords = ['x', 'y'].map(key => ({
  name: `algebraic-inflate-number-of-records--${key}-axis`,
  type: 'algebraic-data',
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap} = prepProv(
      dataset,
      spec,
      view,
      key
    );
    const data = clone(dataset);
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
  explain:
    'bootstrapping the aggregate values to the max number of records should affect the chart'
}));
