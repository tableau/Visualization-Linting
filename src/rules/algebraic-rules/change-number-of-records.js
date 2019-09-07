import {clone, prepProv, filterForMarkRecordChange} from '../../utils';
import {expectDifferent} from '../algebraic-detectors';

export const contractToSingleRecords = ['x', 'y'].map(key => ({
  name: `algebraic-contract-to-single-record--${key}-axis`,
  type: 'algebraic-data',
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap} = prepProv(
      dataset,
      spec,
      view,
      key,
    );
    const data = clone(dataset);
    Object.entries(aggregateOutputPairs).forEach(([terminalKey, aggValue]) => {
      const targetArray = tailToStartMap[terminalKey];
      // don't try to drop any records for single length data
      if (!targetArray || targetArray.length <= 1) {
        return;
      }
      const safeIndex = Math.floor(Math.random() * targetArray.length);
      targetArray.forEach((startKey, idx) => {
        if (idx === safeIndex) {
          return;
        }
        data[startKey] = null;
      });
    });

    return data.filter(d => d);
  },
  selectEvaluator: spec => expectDifferent,
  filter: filterForMarkRecordChange(key),
  explain:
    'reducing the aggregate values to a single record should affect the chart',
}));

export const inflateToCommonNumberOfRecords = ['x', 'y'].map(key => ({
  name: `algebraic-inflate-number-of-records--${key}-axis`,
  type: 'algebraic-data',
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap} = prepProv(
      dataset,
      spec,
      view,
      key,
    );
    const data = clone(dataset);
    const arrayOfArrays = Object.keys(aggregateOutputPairs).map(
      terminalKey => tailToStartMap[terminalKey],
    );
    const maxSize = arrayOfArrays.reduce(
      (acc, val) => Math.max(acc, val.length),
      -Infinity,
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
    'bootstrapping the aggregate values to the max number of records should affect the chart',
}));
