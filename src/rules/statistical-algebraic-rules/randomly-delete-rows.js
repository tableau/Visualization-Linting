import {clone} from '../../utils';
import {
  // expectDifferentLines,
  // expectDifferent,
  // expectDifferentBars,
  testInstrument,
} from '../algebraic-detectors';
import {dropRow} from '../../dirty';
import {NUM_EVALS} from '../index';

const deletingRowsShouldMatter = {
  name: 'algebraic-randomly-delete-rows',
  type: 'algebraic-stat-data',
  operation: container => {
    const clonedData = clone(container);
    for (let i = 0; i < container.length * 0.1; i++) {
      dropRow(clonedData);
    }
    return clonedData;
  },
  selectEvaluator: testInstrument,
  statisticalEval: results => {
    const numPassing = results.reduce((x, {passed}) => x + (passed ? 1 : 0), 0);
    console.log('randomly-delete', numPassing);
    return false;
    // return numPassing > 333;
  },
  generateNumberOfIterations: (dataset, spec, view) => NUM_EVALS,
  filter: (spec, data, view) => {
    return data.length > 0;
  },
  explain:
    'After randomly deleting a third of the rows the image has remained the same. This suggests that there is an aggregator that is doing too much work, be careful.',
};

export default deletingRowsShouldMatter;
