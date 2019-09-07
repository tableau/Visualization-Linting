import {prepProv, clone} from '../../utils';
import {
  expectSameBars,
  expectSameLines,
  expectSame,
} from '../algebraic-detectors';

const decreaseByOne = ['y'].map(key => ({
  name: `algebraic-decrease-by-one--${key}-axis`,
  type: 'algebraic-stat-data',
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
      if (!targetArray) {
        return;
      }
      const randomIndx =
        targetArray[Math.floor(targetArray.length * Math.random())];
      data[randomIndx] = null;
    });
    return data.filter(d => d);
  },
  selectEvaluator: spec => {
    if (spec.mark === 'bar') {
      return expectSameBars;
    }
    if (spec.mark === 'line') {
      return expectSameLines;
    }
    return expectSame;
  },
  generateNumberOfIterations: (dataset, spec, view) => 100,
  statisticalEval: results => {
    const numPassing = results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0);
    console.log('remove one', numPassing);
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
export default decreaseByOne;
