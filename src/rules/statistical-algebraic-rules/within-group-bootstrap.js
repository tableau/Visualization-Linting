import {prepProv} from '../../utils';
import {
  // expectSameBars,
  // expectSameLines,
  // expectSame,
  testInstrument,
} from '../algebraic-detectors';
import {fullResample} from '../../bootstrap';
import {NUM_EVALS} from '../index';

const bootstrapBars = {
  name: `algebraic-within-group-bootstrap`,
  type: 'algebraic-stat-data',
  // operation: (data, spec, view) => bootstrap(clone(data)).samples(data.length),
  operation: (dataset, spec, view) => {
    const {aggregateOutputPairs, tailToStartMap} = prepProv(
      dataset,
      spec,
      view,
      'y', // opposite key as expected
    );
    const data = [];
    Object.keys(aggregateOutputPairs).forEach(terminalKey => {
      fullResample(tailToStartMap[terminalKey] || []).forEach(idx =>
        data.push(dataset[idx]),
      );
    });

    return data;
  },
  selectEvaluator: testInstrument,
  statisticalEval: results => {
    const numPassing = results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0);
    console.log('within-group-bootstrap', numPassing);
    return false;
    // return numPassing > 333;
  },
  generateNumberOfIterations: (dataset, spec, view) => NUM_EVALS,
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
    'Within each aggregate mark, bootstrapping the data results in very different patterns. This suggests unreliability in the aggregate measure, or the data backing it.',
};

export default bootstrapBars;
