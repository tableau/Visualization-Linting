import {prepProv, shuffle} from '../../utils';
// import {fullResample} from '../../bootstrap';
import {
  // expectSameBars,
  // expectSameLines,
  // expectSame,
  testInstrument,
} from '../algebraic-detectors';
import {NUM_EVALS} from '../index';

const contractToFloorRecords = ['y'].map(key => ({
  name: `algebraic-contract-to-floor-records--${key}-axis`,
  type: 'algebraic-stat-data',
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap} = prepProv(
      dataset,
      spec,
      view,
      key,
    );
    // const data = clone(dataset);
    const arrayOfArrays = Object.keys(aggregateOutputPairs).map(
      terminalKey => tailToStartMap[terminalKey],
    );
    const minSize = arrayOfArrays.reduce(
      (acc, val) => Math.min(acc, val.length),
      Infinity,
    );
    const data = [];
    Object.entries(aggregateOutputPairs).forEach(([terminalKey, aggValue]) => {
      const targetArray = tailToStartMap[terminalKey];
      // don't try to drop any records for single length data
      if (!targetArray) {
        return;
      }
      if (targetArray.length === minSize) {
        targetArray.forEach(idx => data.push(dataset[idx]));
        return;
      }
      shuffle(targetArray)
        .slice(0, minSize)
        .forEach(idx => data.push(dataset[idx]));
    });
    return data;
  },
  selectEvaluator: testInstrument,
  generateNumberOfIterations: (dataset, spec, view) => NUM_EVALS,
  statisticalEval: results => {
    const numPassing = results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0);
    console.log('contract to min records', numPassing);
    return false;
    // return numPassing > 333;
  },
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    if (spec.mark !== 'bar' && spec.mark !== 'line') {
      return false;
    }
    // i dont get why this is necessary
    if (!spec.encoding.x.aggregate && !spec.encoding.y.aggregate) {
      return false;
    }
    return true;
  },
  explain:
    'If all aggregate marks have the same number of records as the mark with the fewest number of records, then the chart significantly changes. This suggests large and important discrepancies in aggregation.',
}));
export default contractToFloorRecords;
