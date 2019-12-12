import {clone} from '../../utils';
import {
  // expectSameBars,
  // expectSameLines,
  // expectSame,
  testInstrument,
} from '../algebraic-detectors';
import {bootstrap} from '../../bootstrap';
import {NUM_EVALS} from '../index';

const bootstrapBars = {
  name: `algebraic-bootstrap-bar-chart-bars`,
  type: 'algebraic-stat-data',
  operation: (data, spec, view) => {
    return bootstrap(clone(data)).samples(data.length);
  },
  selectEvaluator: testInstrument,
  statisticalEval: results => {
    const numPassing = results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0);
    console.log('bootstrap-bar-chart', numPassing);
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
    return true;
  },
  explain:
    'When the original data in each bar is bootstrapped, the bar order significantly changes.',
};

export default bootstrapBars;
