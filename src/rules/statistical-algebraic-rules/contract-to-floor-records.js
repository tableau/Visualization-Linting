import {prepProv, shuffle} from '../../utils';
import {fullResample} from '../../bootstrap';
import {
  expectSameBars,
  expectSameLines,
  expectSame,
  testInsturment,
} from '../algebraic-detectors';

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
  selectEvaluator: testInsturment,
  generateNumberOfIterations: (dataset, spec, view) => 100,
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
  explain: 'TODODODODODODODODODODO.',
}));
export default contractToFloorRecords;
