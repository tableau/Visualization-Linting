import {clone} from '../../utils';
import {expectSameBars} from '../algebraic-detectors';
import {bootstrap} from '../../bootstrap';

const bootstrapBars = {
  name: `algebraic-bootstrap-bar-chart-bars`,
  type: 'algebraic-stat-data',
  operation: (data, spec, view) => bootstrap(clone(data)).samples(data.length),
  selectEvaluator: spec => expectSameBars,
  statisticalEval: results => {
    const numPassing = results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0);
    console.log(numPassing);
    return false;
    // return numPassing > 333;
  },
  generateNumberOfIterations: (dataset, spec, view) => 500,
  filter: (spec, data, view) => {
    if (data.length === 0) {
      return false;
    }
    if (spec.mark !== 'bar') {
      return false;
    }
    return true;
  },
  explain:
    'the apparent insight (bar order) was not resilliant to bootstrapping from the original data.'
};

export default bootstrapBars;
